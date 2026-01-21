using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ContasMensais.Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<Usuario> _passwordHasher;

        public AuthService(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Usuario>();
        }

        public async Task<Usuario?> Cadastrar(string nome, string email, string senha)
        {
            var existe = await _context.Usuarios.AnyAsync(u => u.Email == email);
            if (existe) return null;

            var usuario = new Usuario
            {
                Nome = nome,
                Email = email
            };

            usuario.SenhaHash = _passwordHasher.HashPassword(usuario, senha);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return usuario;
        }

        public async Task<Usuario?> Login(string email, string senha)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            if (usuario == null) return null;

            var resultado = _passwordHasher.VerifyHashedPassword(
                usuario,
                usuario.SenhaHash,
                senha
            );

            return resultado == PasswordVerificationResult.Success
                ? usuario
                : null;
        }
    }
}