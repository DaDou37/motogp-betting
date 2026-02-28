namespace MotogpApi.Models
{
    public class Pari
    {
        public int Id { get; set; }
        public DateTime DatePari { get; set; } = DateTime.UtcNow;
        public bool EstValide { get; set; } = false;
        public int PointsGagnes { get; set; } = 0;

        // Le parieur
        public int UtilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; } = null!;

        // Le grand prix concerné
        public int GrandPrixId { get; set; }
        public GrandPrix GrandPrix { get; set; } = null!;

        // Les 3 pilotes pariés
        public int PiloteP1Id { get; set; }
        public Pilote PiloteP1 { get; set; } = null!;

        public int PiloteP2Id { get; set; }
        public Pilote PiloteP2 { get; set; } = null!;

        public int PiloteP3Id { get; set; }
        public Pilote PiloteP3 { get; set; } = null!;
    }
}