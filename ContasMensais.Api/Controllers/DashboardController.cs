using ContasMensais.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ContasMensais.Api.Controllers
{

    [ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("yoy/{ano:int}")]
        public async Task<IActionResult> GetYoy(int ano)
        {
            var resultado = await _dashboardService.CalcularYoyAsync(ano);
            return Ok(resultado);
        }
    }
}