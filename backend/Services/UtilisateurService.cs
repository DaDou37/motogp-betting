using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MotogpApi.Data;
using MotogpApi.DTOs;
using MotogpApi.Models;

namespace MotogpApi.Services
{
    public class UtilisateurService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UtilisateurService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<(bool succes, string message)> Register(RegisterDTO dto)
        {
            // Vérifier si l'email existe déjà
            if (await _context.Utilisateurs.AnyAsync(u => u.Email == dto.Email))
                return (false, "Cet email est déjà utilisé.");

            // Vérifier si le pseudo existe déjà
            if (await _context.Utilisateurs.AnyAsync(u => u.Pseudo == dto.Pseudo))
                return (false, "Ce pseudo est déjà utilisé.");

            // Hasher le mot de passe
            var utilisateur = new Utilisateur
            {
                Pseudo = dto.Pseudo,
                Email = dto.Email,
                MotDePasse = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Points = 0,
                EstAdmin = false
            };

            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();
            return (true, "Inscription réussie !");
        }

        public async Task<(bool succes, string message, AuthResponseDTO? response)> Login(LoginDTO dto)
        {
            // Trouver l'utilisateur
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (utilisateur == null)
                return (false, "Email ou mot de passe incorrect.", null);

            // Vérifier le mot de passe
            if (!BCrypt.Net.BCrypt.Verify(dto.MotDePasse, utilisateur.MotDePasse))
                return (false, "Email ou mot de passe incorrect.", null);

            // Générer le token JWT
            var token = GenererToken(utilisateur);

            return (true, "Connexion réussie !", new AuthResponseDTO
            {
                Token = token,
                Pseudo = utilisateur.Pseudo,
                UtilisateurId = utilisateur.Id,
                EstAdmin = utilisateur.EstAdmin
            });
        }

        private string GenererToken(Utilisateur utilisateur)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, utilisateur.Id.ToString()),
                new Claim(ClaimTypes.Name, utilisateur.Pseudo),
                new Claim(ClaimTypes.Email, utilisateur.Email),
                new Claim("EstAdmin", utilisateur.EstAdmin.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}