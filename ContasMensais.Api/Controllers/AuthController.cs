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
using System.Security.Cryptography;


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
        [AllowAnonymous]
        [HttpPost("register")]
public IActionResult Register([FromBody] RegisterDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // 🔒 Verifica se já existe algum usuário
    var existeUsuario = _context.Usuarios.Any();

            // Se já existir usuário, só admin pode criar novos
            if (existeUsuario)
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                    return Forbid("Somente administradores podem criar usuários");

                if (!User.IsInRole("admin"))
                    return Forbid("Somente administradores podem criar usuários");
            }

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
                Role = roleFinal,
                CriadoEm = DateTime.UtcNow
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

    // 🔄 gera refresh token
var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

usuario.RefreshToken = refreshToken;
usuario.RefreshTokenExpiraEm = DateTime.UtcNow.AddDays(7);

_context.SaveChanges();

// 🔐 access token curto
var tokenDescriptor = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(claims),
    Expires = DateTime.UtcNow.AddMinutes(15),
    SigningCredentials = creds
};

var securityToken = tokenHandler.CreateToken(tokenDescriptor);
var tokenString = tokenHandler.WriteToken(securityToken);

 return Ok(new
        {
            token = tokenString,
            refreshToken = refreshToken,
            usuario = new
            {
                usuario.Id,
                usuario.Nome,
                usuario.Email,
                usuario.Role
            }
        });
    }

    // =========================
    // REFRESH TOKEN
    // =========================
     [AllowAnonymous]
    [HttpPost("refresh")]
    public IActionResult RefreshToken([FromBody] RefreshTokenDto dto)
    {
        var usuario = _context.Usuarios
            .FirstOrDefault(u =>
                u.RefreshToken == dto.RefreshToken &&
                u.RefreshTokenExpiraEm > DateTime.UtcNow
            );

        if (usuario == null)
            return Unauthorized("Refresh token inválido ou expirado");

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
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials = creds
        };

        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(securityToken);

        return Ok(new
        {
            token = tokenString
        });
    }

    // =========================
    // LOGOUT — INVALIDA REFRESH TOKEN
    // =========================
    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var usuario = _context.Usuarios
            .FirstOrDefault(u => u.Id == int.Parse(userId));

        if (usuario == null)
            return Unauthorized();

        // 🔥 invalida refresh token
        usuario.RefreshToken = null;
        usuario.RefreshTokenExpiraEm = null;

        _context.SaveChanges();

        return Ok(new { message = "Logout realizado com sucesso" });
    }
}
}