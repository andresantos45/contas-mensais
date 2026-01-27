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
    [Route("api/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        


        // 📥 LISTAR
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categorias = await _context.Categorias
    .Select(c => new
    {
        c.Id,
        c.Nome
    })
    .ToListAsync();

            return Ok(categorias);
        }

        // ➕ CRIAR
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Categoria categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Nome))
                return BadRequest("Nome inválido");

            _context.Categorias.Add(categoria);
await _context.SaveChangesAsync();

            return Ok(new
            {
                categoria.Id,
                categoria.Nome
            });
        }

        // ❌ EXCLUIR  ← ESTE BLOCO PRECISA EXISTIR
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var categoria = await _context.Categorias
    .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return NotFound();

            // 🔒 impede exclusão se estiver em uso
            var emUso = await _context.Contas
    .AnyAsync(c => c.CategoriaId == id);

            if (emUso)
                return BadRequest("Categoria está vinculada a contas");

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}