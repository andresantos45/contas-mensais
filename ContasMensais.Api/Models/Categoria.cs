using System.Text.Json.Serialization;

namespace ContasMensais.Api.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        // 🔐 Dono da categoria
        public int UsuarioId { get; set; }

        [JsonIgnore]
        public Usuario? Usuario { get; set; }
    }
}