using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        private const string JWT_KEY = "CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_123!";

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // REGISTRO DE USUÁRIO
        // =========================
        [HttpPost("register")]
        public IActionResult Register(Usuario usuario)
        {
            var existe = _context.Usuarios.Any(u => u.Email == usuario.Email);
            if (existe)
                return BadRequest("Email já cadastrado");

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            return Ok("Usuário criado com sucesso");
        }

        // =========================
        // LOGIN COM JWT
        // =========================
        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var usuario = _context.Usuarios
                .FirstOrDefault(u =>
                    u.Email == dto.Email &&
                    u.SenhaHash == dto.Senha
                );

            if (usuario == null)
                return Unauthorized("Usuário ou senha inválidos");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(JWT_KEY)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
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
