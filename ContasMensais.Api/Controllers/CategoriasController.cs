using Microsoft.AspNetCore.Mvc;
using ContasMensais.Api.Data;

namespace ContasMensais.Api.Controllers
{
    [ApiController]
    [Route("api/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Categorias.ToList());
        }
    }
}