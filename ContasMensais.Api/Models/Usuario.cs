using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    [Table("usuarios")] // 🔴 OBRIGATÓRIO
    public class Usuario
    {
        [Key]              // 🔴 OBRIGATÓRIO
        [Column("Id")]     // 🔴 I MAIÚSCULO (EXATAMENTE COMO NO BANCO)
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;

        [Column("Role")] // R MAIÚSCULO (como no banco)
        public string Role { get; set; } = "user";

        [Column("criado_em")]
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
         public ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
    }
    
    
}