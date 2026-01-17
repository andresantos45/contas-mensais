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

        private int ObterUsuarioId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");

            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Usuário não autenticado");

            return int.Parse(userIdClaim.Value);
        }

        // 📥 LISTAR CATEGORIAS DO USUÁRIO
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

        // ➕ CRIAR CATEGORIA
        [HttpPost]
public async Task<IActionResult> Post([FromBody] Categoria categoria)
{
    if (categoria == null || string.IsNullOrWhiteSpace(categoria.Nome))
        return BadRequest("Categoria inválida");

    var usuarioId = ObterUsuarioId();

    var existe = await _context.Categorias.AnyAsync(c =>
        c.UsuarioId == usuarioId &&
        c.Nome.ToLower() == categoria.Nome.ToLower()
    );

    if (existe)
        return BadRequest("Categoria já existe");

    categoria.UsuarioId = usuarioId;

    _context.Categorias.Add(categoria);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        categoria.Id,
        categoria.Nome
    });
}
    }
}
    

    
