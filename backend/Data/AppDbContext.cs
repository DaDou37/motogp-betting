using Microsoft.EntityFrameworkCore;
using MotogpApi.Models;

namespace MotogpApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Chaque DbSet = une table en BDD
        public DbSet<Pilote> Pilotes { get; set; }
        public DbSet<GrandPrix> GrandsPrix { get; set; }
        public DbSet<Resultat> Resultats { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Pari> Paris { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration du Pari avec ses 3 pilotes
            modelBuilder.Entity<Pari>()
                .HasOne(p => p.PiloteP1)
                .WithMany()
                .HasForeignKey(p => p.PiloteP1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pari>()
                .HasOne(p => p.PiloteP2)
                .WithMany()
                .HasForeignKey(p => p.PiloteP2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pari>()
                .HasOne(p => p.PiloteP3)
                .WithMany()
                .HasForeignKey(p => p.PiloteP3Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}