using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Route("api/contas")]
    public class ContasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContasController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 MÊS OU ANO INTEIRO
        // mes = 0 → retorna o ano inteiro
        [HttpGet("{mes:int}/{ano:int}")]
        public async Task<IActionResult> Get(int mes, int ano)
        {
            var query = _context.Contas
                .Include(c => c.Categoria)
                .Where(c => c.Data.Year == ano);

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
        public async Task<IActionResult> Put(int id, [FromBody] Conta conta)
        {
            if (id != conta.Id)
                return BadRequest("Id inconsistente");

            _context.Entry(conta).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // ❌ DELETAR CONTA
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var conta = await _context.Contas.FindAsync(id);
            if (conta == null)
                return NotFound();

            _context.Contas.Remove(conta);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}