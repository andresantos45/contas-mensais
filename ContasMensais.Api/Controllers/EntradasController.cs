using ContasMensais.Api.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Route("entradas")]
    public class EntradasController : ControllerBase
    {
        private readonly IConfiguration _config;

        public EntradasController(IConfiguration config)
        {
            _config = config;
        }

        private NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(
                _config.GetConnectionString("DefaultConnection")
            );
        }

        // POST /entradas
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Entrada entrada)
        {
            if (string.IsNullOrWhiteSpace(entrada.Descricao) ||
                entrada.Valor <= 0 ||
                entrada.Data == default ||
                entrada.CategoriaId <= 0)
            {
                return BadRequest("Dados inválidos");
            }

            entrada.Mes = entrada.Data.Month;
            entrada.Ano = entrada.Data.Year;

            using var conn = GetConnection();

            var sql = @"
                INSERT INTO entradas
                (descricao, valor, data, mes, ano, categoria_id)
                VALUES
                (@Descricao, @Valor, @Data, @Mes, @Ano, @CategoriaId)
                RETURNING id
            ";

            var id = await conn.ExecuteScalarAsync<int>(sql, entrada);

            entrada.Id = id;

            return Created($"/entradas/{id}", entrada);
        }

        // GET /entradas/{mes}/{ano}
        [HttpGet("{mes}/{ano}")]
        public async Task<IActionResult> Listar(int mes, int ano)
        {
            using var conn = GetConnection();

            var sql = @"
                SELECT
                    e.id,
                    e.descricao,
                    e.valor,
                    e.data,
                    e.mes,
                    e.ano,
                    e.categoria_id AS CategoriaId,
                    c.nome AS CategoriaNome
                FROM entradas e
                JOIN categorias c ON c.id = e.categoria_id
                WHERE
                    (@Mes = 0 OR e.mes = @Mes)
                    AND e.ano = @Ano
                ORDER BY e.data ASC
            ";

            var entradas = await conn.QueryAsync<Entrada>(sql, new
            {
                Mes = mes,
                Ano = ano
            });

            return Ok(entradas);
        }

        // PUT /entradas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] Entrada entrada)
        {
            entrada.Mes = entrada.Data.Month;
            entrada.Ano = entrada.Data.Year;

            using var conn = GetConnection();

            var sql = @"
                UPDATE entradas
                SET
                    descricao = @Descricao,
                    valor = @Valor,
                    data = @Data,
                    mes = @Mes,
                    ano = @Ano,
                    categoria_id = @CategoriaId
                WHERE id = @Id
            ";

            await conn.ExecuteAsync(sql, new
            {
                entrada.Descricao,
                entrada.Valor,
                entrada.Data,
                entrada.Mes,
                entrada.Ano,
                entrada.CategoriaId,
                Id = id
            });

            return NoContent();
        }

        // DELETE /entradas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            using var conn = GetConnection();

            var sql = "DELETE FROM entradas WHERE id = @Id";

            await conn.ExecuteAsync(sql, new { Id = id });

            return NoContent();
        }
    }
}