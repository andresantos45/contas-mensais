using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    [Table("categorias_contas")]
    public class CategoriaConta
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("usuarioid")]
        public int UsuarioId { get; set; }

        public Usuario Usuario { get; set; } = null!;
    }
}
