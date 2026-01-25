using System.Linq;
using Microsoft.AspNetCore.Authorization;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace ContasMensais.Api.Controllers
{
   

[ApiController]
[Authorize]
[Route("api/contas")]
public class ContasController : ControllerBase
{
        private readonly AppDbContext _context;

        public ContasController(AppDbContext context)
        {
            _context = context;
        }


private int ObterUsuarioId()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrEmpty(userId))
        throw new UnauthorizedAccessException("Usuário não autenticado");

    return int.Parse(userId);
}
        // 🔍 MÊS OU ANO INTEIRO
        // mes = 0 → retorna o ano inteiro
        [HttpGet("{mes:int}/{ano:int}")]
        public async Task<IActionResult> Get(int mes, int ano)
        {
            var usuarioId = ObterUsuarioId();

var query = _context.Contas
    .Include(c => c.Categoria)
    .Where(c =>
        c.UsuarioId == usuarioId &&
        c.Data.Year == ano
    );


            if (mes != 0)
{
    query = query.Where(c => c.Data.Month == mes);
}

            var contas = await query
    .Select(c => new
{
    c.Id,
    c.Descricao,
    c.Valor,
    Data = c.Data,          // ✅ NECESSÁRIO
    Mes = c.Data.Month,
    Ano = c.Data.Year,
    CategoriaId = c.CategoriaId, // ✅ NECESSÁRIO
    CategoriaNome = c.Categoria != null ? c.Categoria.Nome : null
})
    .ToListAsync();

            return Ok(contas);
        }

        // ➕ CRIAR CONTA
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Conta conta)
{
    var usuarioId = ObterUsuarioId();

    if (conta == null)
        return BadRequest("Conta inválida");

    if (conta.Valor <= 0)
    return BadRequest("Valor inválido");

if (conta.Data == default)
    return BadRequest("Data inválida");

    // 🔒 garante que a categoria pertence ao usuário
    var categoriaExiste = await _context.Categorias.AnyAsync(c =>
        c.Id == conta.CategoriaId &&
        c.UsuarioId == usuarioId
    );

    if (!categoriaExiste)
        return BadRequest("Categoria inválida para o usuário");

    conta.UsuarioId = usuarioId;

    _context.Contas.Add(conta);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        conta.Id,
        conta.Descricao,
        conta.Valor,
        Mes = conta.Data.Month,
        Ano = conta.Data.Year,
        conta.CategoriaId
    });
}

        // ✏️ ATUALIZAR CONTA
        [HttpPut("{id:int}")]
public async Task<IActionResult> Put(int id, [FromBody] Conta contaAtualizada)
{
    var usuarioId = ObterUsuarioId();

    var conta = await _context.Contas
        .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);

    if (conta == null)
        return NotFound("Conta não encontrada ou não pertence ao usuário");

    // 🔒 Atualiza SOMENTE os campos permitidos
    conta.Descricao = contaAtualizada.Descricao;
    conta.Valor = contaAtualizada.Valor;
    conta.Data = contaAtualizada.Data;
    conta.CategoriaId = contaAtualizada.CategoriaId;

    await _context.SaveChangesAsync();

    return Ok("Conta atualizada com sucesso");
}

        // ❌ DELETAR CONTA
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuarioId = ObterUsuarioId();

var conta = await _context.Contas
    .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);
            if (conta == null)
                return NotFound();

            _context.Contas.Remove(conta);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}