using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using System.Security.Claims;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/categorias-contas")]
    public class CategoriasContasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasContasController(AppDbContext context)
        {
            _context = context;
        }

        // 🔐 MÉTODO AUXILIAR (fica NA CLASSE, não dentro de actions)
        private bool TryGetUsuarioId(out int usuarioId)
        {
            usuarioId = 0;

            var claim =
                User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                User.FindFirstValue("sub") ??
                User.FindFirstValue("id");

            return int.TryParse(claim, out usuarioId);
        }

        // 📥 LISTAR CATEGORIAS DE CONTAS (POR USUÁRIO)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            if (!TryGetUsuarioId(out var usuarioId))
                return Unauthorized();

            var categorias = await _context.CategoriasContas
                .Where(c => c.UsuarioId == usuarioId)
                .OrderBy(c => c.Nome)
                .Select(c => new
                {
                    c.Id,
                    c.Nome
                })
                .ToListAsync();

            return Ok(new
{
    success = true,
    data = categorias
});
        }

        // ➕ CRIAR CATEGORIA
        public class CriarCategoriaContaDTO
        {
            public string Nome { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CriarCategoriaContaDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome inválido");

            if (!TryGetUsuarioId(out var usuarioId))
                return Unauthorized();

            var existe = await _context.CategoriasContas.AnyAsync(c =>
                c.UsuarioId == usuarioId &&
                c.Nome.ToLower() == dto.Nome.ToLower()
            );

            if (existe)
                return BadRequest("Categoria já existe");

            var categoria = new CategoriaConta
            {
                Nome = dto.Nome,
                UsuarioId = usuarioId
            };

            _context.CategoriasContas.Add(categoria);
            await _context.SaveChangesAsync();

            return Ok(new
{
    success = true,
    data = new
    {
        categoria.Id,
        categoria.Nome
    }
});
        }

        // ❌ EXCLUIR CATEGORIA
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!TryGetUsuarioId(out var usuarioId))
                return Unauthorized();

            var categoria = await _context.CategoriasContas
                .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);

            if (categoria == null)
                return NotFound();

            _context.CategoriasContas.Remove(categoria);
            await _context.SaveChangesAsync();

            return Ok(new
{
    success = true
});
        }
    }
}