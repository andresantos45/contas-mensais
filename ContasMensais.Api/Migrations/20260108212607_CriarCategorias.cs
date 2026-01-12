using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ContasMensais.Api.Migrations
{
    /// <inheritdoc />
    public partial class CriarCategorias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Contas");

            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "Contas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contas_CategoriaId",
                table: "Contas",
                column: "CategoriaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contas_Categorias_CategoriaId",
                table: "Contas",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contas_Categorias_CategoriaId",
                table: "Contas");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Contas_CategoriaId",
                table: "Contas");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Contas");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Contas",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
