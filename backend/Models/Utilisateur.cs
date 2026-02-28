namespace MotogpApi.Models
{
    public class Utilisateur
    {
        public int Id { get; set; }
        public string Pseudo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
        public int Points { get; set; } = 0;
        public bool EstAdmin { get; set; } = false;

        // Relations
        public ICollection<Pari> Paris { get; set; } = new List<Pari>();
    }
}