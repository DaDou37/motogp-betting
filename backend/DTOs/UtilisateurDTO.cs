namespace MotogpApi.DTOs
{
    public class RegisterDTO
    {
        public string Pseudo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }

    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }

    public class AuthResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public string Pseudo { get; set; } = string.Empty;
        public int UtilisateurId { get; set; }
        public bool EstAdmin { get; set; }
    }
}