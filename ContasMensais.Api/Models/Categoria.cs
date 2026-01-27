using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    [Table("categorias")]
    public class Categoria
    {
        [Key]
        [Column("id")] // exatamente como no banco
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}