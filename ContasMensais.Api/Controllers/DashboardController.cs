using ContasMensais.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ContasMensais.Api.Controllers
{

    [ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private int ObterUsuarioId()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrEmpty(userId))
        throw new UnauthorizedAccessException("Usuário não autenticado");

    return int.Parse(userId);
}
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("yoy/{ano:int}")]
public async Task<IActionResult> GetYoy(int ano)
{
    var usuarioId = ObterUsuarioId();

    var resultado = await _dashboardService.CalcularYoyAsync(ano, usuarioId);
    return Ok(new
{
    success = true,
    data = resultado
});
}

    }
}