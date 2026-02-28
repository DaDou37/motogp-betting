namespace MotogpApi.Models
{
    public class Pilote
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Nationalite { get; set; } = string.Empty;
        public int Numero { get; set; }
        public string Equipe { get; set; } = string.Empty;
        public string PhotoUrl { get; set; } = string.Empty;

        // Relations
        public ICollection<Resultat> Resultats { get; set; } = new List<Resultat>();
    }
}