using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
   [Table("usuarios")]
public class Usuario
{
    [Key]
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public DateTime CriadoEm { get; set; }
}
}