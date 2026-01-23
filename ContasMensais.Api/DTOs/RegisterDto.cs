using System.ComponentModel.DataAnnotations;

namespace ContasMensais.Api.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Senha { get; set; } = string.Empty;

        [Required]
        [RegularExpression("admin|user")]
        public string Role { get; set; } = "user";
    }
}