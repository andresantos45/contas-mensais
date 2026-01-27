using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using System.Security.Claims;
using ContasMensais.Api.DTOs;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔐 USUÁRIO LOGADO
        // =========================
        private int ObterUsuarioId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedAccessException("Usuário não autenticado");

            return int.Parse(userId);
        }

        // =========================
        // 📥 LISTAR CATEGORIAS
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var usuarioId = ObterUsuarioId();

            var categorias = await _context.Categorias
                .Where(c => c.UsuarioId == usuarioId)
                .Select(c => new
                {
                    c.Id,
                    c.Nome
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // =========================
        // ➕ CRIAR CATEGORIA
        // =========================
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CriarCategoriaDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome inválido");

            var categoria = new Categoria
            {
                Nome = dto.Nome,
                UsuarioId = ObterUsuarioId(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                categoria.Id,
                categoria.Nome
            });
        }

        // =========================
        // ❌ EXCLUIR CATEGORIA
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuarioId = ObterUsuarioId();

            var categoria = await _context.Categorias
                .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);

            if (categoria == null)
                return NotFound();

            var emUso = await _context.Contas
                .AnyAsync(c => c.CategoriaId == id && c.UsuarioId == usuarioId);

            if (emUso)
                return BadRequest("Categoria está vinculada a contas");

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}