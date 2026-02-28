namespace MotogpApi.Models
{
    public class Resultat
    {
        public int Id { get; set; }
        public int Position { get; set; } // 1, 2 ou 3
        
        // Relations
        public int GrandPrixId { get; set; }
        public GrandPrix GrandPrix { get; set; } = null!;
        
        public int PiloteId { get; set; }
        public Pilote Pilote { get; set; } = null!;
    }
}