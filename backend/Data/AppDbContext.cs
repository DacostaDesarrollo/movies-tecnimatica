using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext: DbContext {

    public AppDbContext(DbContextOptions<AppDbContext> options) : base (options){}

    public DbSet<User> Users {get; set;}
    public DbSet<FavoriteMovie> FavoriteMovies {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder){
        base.OnModelCreating(modelBuilder);

        // Validaciones del modelo usuario
        modelBuilder.Entity<User>(entity =>{
            entity.ToTable("users"); // Nombre de tabla en minúsculas
            entity.HasKey(e   => e.Id);
            entity.Property(e => e.Id).HasColumnName("id_user");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique(); //El Email es unico
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash").IsRequired(); // Obligatorio
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // Configurar FavoriteMovie
        modelBuilder.Entity<FavoriteMovie>(entity =>
        {
            entity.ToTable("favorite_movies"); // Nombre de tabla
            entity.HasKey(e   => e.Id);
            entity.Property(e => e.Id).HasColumnName("id_favorite_movie");
            entity.Property(e => e.UserId).HasColumnName("user_id_favorite_movie");
            entity.Property(e => e.ImdbId).HasColumnName("imdb_id_favorite_movie").IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            // Relación con User
            entity.HasOne(e => e.User)
                  .WithMany(u => u.FavoriteMovies)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });


    }

}