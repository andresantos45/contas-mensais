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

return Ok(new
{
    success = true,
    data = categorias
});
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

    var nomeNormalizado = dto.Nome.Trim().ToLower();

    var existe = await _context.CategoriasEntradas
        .AnyAsync(c => c.Nome.ToLower() == nomeNormalizado);

    if (existe)
        return Conflict("Categoria já existe.");

    var categoria = new CategoriaEntrada
{
    Nome = dto.Nome.Trim()
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

    // 🔒 VERIFICA SE EXISTE ENTRADA USANDO A CATEGORIA
    var emUso = await _context.Entradas
        .AnyAsync(e => e.CategoriaId == id);

    if (emUso)
        return Conflict("Esta categoria está vinculada a uma ou mais entradas e não pode ser excluída.");

    try
    {
        _context.CategoriasEntradas.Remove(categoria);
        await _context.SaveChangesAsync();
        return Ok(new
{
    success = true
});
    }
    catch (DbUpdateException)
    {
        // Proteção contra sujeira de dados / FK
        return Conflict("Não foi possível excluir a categoria porque ela está em uso.");
    }
    catch (Exception)
    {
        return StatusCode(500, "Erro interno ao excluir categoria.");
    }
}
}
}