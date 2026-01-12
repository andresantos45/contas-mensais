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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

                entity.HasOne(e => e.Categoria)
                      .WithMany()
                      .HasForeignKey(e => e.CategoriaId);
            });
        }
    }
}