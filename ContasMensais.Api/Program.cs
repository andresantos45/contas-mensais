using ContasMensais.Api.Data;
using ContasMensais.Api.Models;
using Microsoft.EntityFrameworkCore;
using ContasMensais.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();
builder.Services.AddScoped<DashboardService>();
// Entity Framework + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=contas.db");
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 🔴 GARANTIR QUE O BANCO E AS TABELAS EXISTEM
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Cria banco e tabelas automaticamente
    context.Database.EnsureCreated();

    // Popula categorias iniciais
    if (!context.Categorias.Any())
    {
        context.Categorias.AddRange(
            new Categoria { Nome = "Moradia" },
            new Categoria { Nome = "Alimentação" },
            new Categoria { Nome = "Energia" },
            new Categoria { Nome = "Água" },
            new Categoria { Nome = "Internet" },
            new Categoria { Nome = "Outros" }
        );

        context.SaveChanges();
    }
}

// Middlewares
app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();