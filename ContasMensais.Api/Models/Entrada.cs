using System.ComponentModel.DataAnnotations.Schema;

namespace ContasMensais.Api.Models
{
    [Table("entradas")]
    public class Entrada
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("descricao")]
        public string Descricao { get; set; } = string.Empty;

        [Column("valor")]
        public decimal Valor { get; set; }

        [Column("data")]
        public DateTime Data { get; set; }

        [Column("mes")]
        public int Mes { get; set; }

        [Column("ano")]
        public int Ano { get; set; }

        [Column("categoria_id")]
        public int CategoriaId { get; set; }

        // ❌ NÃO EXISTE NO BANCO
        [NotMapped]
        public string CategoriaNome { get; set; } = string.Empty;

        // 🔐 DONO DA ENTRADA
        [Column("usuario_id")]
        public int UsuarioId { get; set; }
    }
}