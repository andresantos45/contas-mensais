using System.ComponentModel.DataAnnotations;

namespace ContasMensais.Api.DTOs
{
    public class CriarCategoriaDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
    }
}