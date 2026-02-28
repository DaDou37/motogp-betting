namespace MotogpApi.Models
{
    public class GrandPrix
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Circuit { get; set; } = string.Empty;
        public string Pays { get; set; } = string.Empty;
        public DateTime DateCourse { get; set; }
        public bool EstTermine { get; set; } = false;

        // Relations
        public ICollection<Resultat> Resultats { get; set; } = new List<Resultat>();
        public ICollection<Pari> Paris { get; set; } = new List<Pari>();
    }
}