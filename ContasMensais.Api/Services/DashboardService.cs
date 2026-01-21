using ContasMensais.Api.Data;
using ContasMensais.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ContasMensais.Api.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<YoyDto>> CalcularYoyAsync(int ano, int usuarioId)
        {
            var dados = await _context.Contas
                .Where(d =>
                    d.UsuarioId == usuarioId &&
                    (d.Data.Year == ano || d.Data.Year == ano - 1)
                )
                .GroupBy(d => new { d.Data.Year, d.Data.Month })
                .Select(g => new
                {
                    Ano = g.Key.Year,
                    Mes = g.Key.Month,
                    Total = g.Sum(x => x.Valor)
                })
                .ToListAsync();

            var resultado = new List<YoyDto>();

            for (int mes = 1; mes <= 12; mes++)
            {
                var atual = dados.FirstOrDefault(x => x.Ano == ano && x.Mes == mes);
                var anterior = dados.FirstOrDefault(x => x.Ano == ano - 1 && x.Mes == mes);

                if (atual == null)
                    continue;

                decimal? yoy = null;

                if (anterior != null && anterior.Total != 0)
                {
                    yoy = ((atual.Total - anterior.Total) / anterior.Total) * 100;
                }

                resultado.Add(new YoyDto
                {
                    Ano = ano,
                    Mes = mes,
                    TotalAtual = atual.Total,
                    TotalAnoAnterior = anterior?.Total ?? 0,
                    YoyPercentual = yoy
                });
            }

            return resultado;
        }
    }
}