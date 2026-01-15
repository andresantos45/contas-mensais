using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ContasMensais.Api.DTOs;

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
public IActionResult Register(RegisterDto dto)
{
    var existe = _context.Usuarios.Any(u => u.Email == dto.Email);
    if (existe)
        return BadRequest("Email já cadastrado");

    var usuario = new Usuario
    {
        Nome = dto.Nome,
        Email = dto.Email,
        SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
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
public IActionResult Login(LoginDto dto)
{
    var usuario = _context.Usuarios
        .FirstOrDefault(u => u.Email == dto.Email);

    if (usuario == null)
        return Unauthorized("Usuário ou senha inválidos");

    // 🔐 valida senha com BCrypt
    if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
        return Unauthorized("Usuário ou senha inválidos");
    var claims = new[]
{
    new Claim("id", usuario.Id.ToString()),
    new Claim(ClaimTypes.Email, usuario.Email)
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

    var token = new JwtSecurityToken(
    claims: claims,
    expires: DateTime.Now.AddHours(8),
    signingCredentials: creds
);

    var tokenString = new JwtSecurityTokenHandler()
        .WriteToken(token);

    return Ok(new
    {
        token = tokenString
    });
}

    }

    // =========================
    // DTO DE LOGIN
    // =========================
   public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}
}
