using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/categorias-entradas")]
    public class CategoriasEntradasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasEntradasController(AppDbContext context)
        {
            _context = context;
        }

        // 📥 LISTAR
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categorias = await _context.CategoriasEntradas
                .OrderBy(c => c.Nome)
                .Select(c => new
                {
                    c.Id,
                    c.Nome
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // ➕ CRIAR
        public class CriarCategoriaEntradaDTO
{
    public string Nome { get; set; } = string.Empty;
}

[HttpPost]
public async Task<IActionResult> Post([FromBody] CriarCategoriaEntradaDTO dto)
{
    if (string.IsNullOrWhiteSpace(dto.Nome))
        return BadRequest("Nome inválido");

    var categoria = new CategoriaEntrada
    {
        Nome = dto.Nome
    };

    _context.CategoriasEntradas.Add(categoria);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        categoria.Id,
        categoria.Nome
    });
}

        // ❌ EXCLUIR
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var categoria = await _context.CategoriasEntradas
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return NotFound();

            _context.CategoriasEntradas.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}