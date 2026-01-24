using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using ContasMensais.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // =========================
        // REGISTRO DE USUÁRIO
        // =========================
       [Authorize]
[HttpPost("register")]
public IActionResult Register([FromBody] RegisterDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // 🔒 Verifica se já existe algum usuário
    var existeUsuario = _context.Usuarios.Any();

    // Se já existir usuário, só admin pode criar novos
    if (existeUsuario && !User.IsInRole("admin"))
        return Forbid("Somente administradores podem criar usuários");

    var existeEmail = _context.Usuarios.Any(u => u.Email == dto.Email);
    if (existeEmail)
        return BadRequest("Email já cadastrado");

    string roleFinal;

// PRIMEIRO USUÁRIO DO SISTEMA → ADMIN AUTOMÁTICO
if (!existeUsuario)
{
    roleFinal = "admin";
}
else
{
    // SE JÁ EXISTE USUÁRIO, SOMENTE ADMIN PODE CRIAR
    if (!User.IsInRole("admin"))
        return Forbid("Somente administradores podem criar usuários");

    // 🔐 BACKEND DECIDE — FRONTEND NÃO TEM PODER
    roleFinal = dto.Role == "admin" ? "admin" : "user";
}

var usuario = new Usuario
{
    Nome = dto.Nome,
    Email = dto.Email,
    SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
    Role = roleFinal
};

    _context.Usuarios.Add(usuario);
    _context.SaveChanges();

    return Ok(new { message = "Usuário criado com sucesso" });
}

        // =========================
        // LOGIN COM JWT
        // =========================
        [AllowAnonymous]
[HttpPost("login")]
public IActionResult Login([FromBody] LoginDto dto)
{
    var usuario = _context.Usuarios
        .FirstOrDefault(u => u.Email == dto.Email);

    if (usuario == null)
        return Unauthorized("Usuário ou senha inválidos");

    if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
        return Unauthorized("Usuário ou senha inválidos");

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
        new Claim(ClaimTypes.Email, usuario.Email),
        new Claim(ClaimTypes.Role, usuario.Role)
    };

    var jwtKey = _configuration["JWT_KEY"]
        ?? "CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_123!";

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwtKey)
    );

    var creds = new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

    var tokenHandler = new JwtSecurityTokenHandler();

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddHours(8),
        SigningCredentials = creds
    };

    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(securityToken);

    return Ok(new
    {
        token = tokenString,
        usuario = new
        {
            usuario.Id,
            usuario.Nome,
            usuario.Email,
            usuario.Role
        }
    });
}

    }
}