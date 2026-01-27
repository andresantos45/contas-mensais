using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Models;

namespace ContasMensais.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Conta> Contas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ======================
// USUARIO (MAPEAMENTO POSTGRES REAL)
// ======================
modelBuilder.Entity<Usuario>(entity =>
{
    entity.ToTable("usuarios", "public");

entity.HasKey(e => e.Id);

entity.Property(e => e.Id)
      .HasColumnName("Id")   // ✅ I MAIÚSCULO — IGUAL AO BANCO
      .ValueGeneratedOnAdd();

    entity.Property(e => e.Nome)
          .HasColumnName("nome");

    entity.Property(e => e.Email)
          .HasColumnName("email");

    entity.Property(e => e.SenhaHash)
          .HasColumnName("senha_hash");

    entity.Property(e => e.Role)
      .HasColumnName("Role");

    entity.Property(e => e.CriadoEm)
          .HasColumnName("criado_em");
});

// ======================
// FIXA NOMES DAS TABELAS RESTANTES
// ======================
modelBuilder.Entity<Conta>().ToTable("contas");
modelBuilder.Entity<Categoria>().ToTable("categorias");

            // ======================
            // CONTA
            // ======================
            modelBuilder.Entity<Conta>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Descricao)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.Valor)
                      .HasColumnType("decimal(18,2)");

                entity.Property(e => e.Data)
                      .IsRequired();

                // 🔗 Categoria
                entity.HasOne(e => e.Categoria)
                      .WithMany()
                      .HasForeignKey(e => e.CategoriaId)
                      .OnDelete(DeleteBehavior.Cascade);

                // 🔐 Usuário (DONO DA CONTA)
                entity.HasOne(e => e.Usuario)
                      .WithMany()
                      .HasForeignKey(e => e.UsuarioId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ======================
            // CATEGORIA
            // ======================
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Nome)
                      .IsRequired()
                      .HasMaxLength(100);

                          });
        }
    }
}