using ContasMensais.Api.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Microsoft.AspNetCore.Authorization;
using ContasMensais.Api.DTOs;
using System.Security.Claims;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Route("api/entradas")]
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
        [Authorize]
[HttpPost]
public async Task<IActionResult> Criar([FromBody] EntradaDTO dto)
{
    if (string.IsNullOrWhiteSpace(dto.Descricao) ||
        dto.Valor <= 0 ||
        dto.Data == default ||
        dto.CategoriaId <= 0)
    {
        return BadRequest("Dados inválidos");
    }

    var usuarioId = int.Parse(
    User.FindFirstValue(ClaimTypes.NameIdentifier)!
);

var entrada = new Entrada
{
    Descricao = dto.Descricao,
    Valor = dto.Valor,
    Data = dto.Data,
    CategoriaId = dto.CategoriaId,
    Mes = dto.Data.Month,
    Ano = dto.Data.Year,
    UsuarioId = usuarioId
};

            using var conn = GetConnection();

// 🔒 valida se a categoria de entrada existe
var categoriaExiste = await conn.ExecuteScalarAsync<int>(
    @"SELECT COUNT(1) FROM categorias_entradas WHERE id = @Id",
    new { Id = dto.CategoriaId }
);

if (categoriaExiste == 0)
{
    return BadRequest("Categoria de entrada inválida");
}

var sql = @"
    INSERT INTO entradas
(descricao, valor, data, mes, ano, categoria_id, usuario_id)
VALUES
(@Descricao, @Valor, @Data, @Mes, @Ano, @CategoriaId, @UsuarioId)
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
    JOIN categorias_entradas c ON c.id = e.categoria_id
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

// 🔒 valida categoria de entrada
var categoriaExiste = await conn.ExecuteScalarAsync<int>(
   @"SELECT COUNT(1) FROM categorias_entradas WHERE id = @CategoriaId",
    new { entrada.CategoriaId }
);

if (categoriaExiste == 0)
{
    return BadRequest("Categoria de entrada inválida");
}

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