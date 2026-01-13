using System.Linq;
using Microsoft.AspNetCore.Authorization;
using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");

    if (userIdClaim == null)
    throw new UnauthorizedAccessException("Usuário não autenticado");

    return int.Parse(userIdClaim.Value);
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
                    Mes = c.Data.Month,
                    Ano = c.Data.Year,
                    CategoriaNome = c.Categoria != null ? c.Categoria.Nome : null
                })
                .ToListAsync();

            return Ok(contas);
        }

        // ➕ CRIAR CONTA
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Conta conta)
        {
            if (conta == null)
                return BadRequest("Conta inválida");

            var usuarioId = ObterUsuarioId();
conta.UsuarioId = usuarioId;

_context.Contas.Add(conta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(Get),
                new
                {
                    mes = conta.Data.Month,
                    ano = conta.Data.Year
                },
                new
                {
                    conta.Id,
                    conta.Descricao,
                    conta.Valor,
                    Mes = conta.Data.Month,
                    Ano = conta.Data.Year,
                    conta.CategoriaId
                }
            );
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