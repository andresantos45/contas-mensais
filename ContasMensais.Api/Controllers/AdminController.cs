using ContasMensais.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Authorize(Roles = "admin")]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // LISTAR USUÁRIOS
        [HttpGet("usuarios")]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new
                {
                    u.Id,
                    u.Nome,
                    u.Email,
                    u.Role,
                    u.CriadoEm
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        // EXCLUIR USUÁRIO
        [HttpDelete("usuarios/{id:int}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound("Usuário não encontrado");

            // 🔒 NÃO PERMITE EXCLUIR O ÚLTIMO ADMIN
            if (usuario.Role == "admin")
            {
                var totalAdmins = await _context.Usuarios
                    .CountAsync(u => u.Role == "admin");

                if (totalAdmins <= 1)
                    return BadRequest("Não é permitido excluir o último administrador");
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}