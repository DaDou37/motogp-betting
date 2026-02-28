using Microsoft.EntityFrameworkCore;
using MotogpApi.Data;
using MotogpApi.DTOs;
using MotogpApi.Models;

namespace MotogpApi.Services
{
    public class PariService
    {
        private readonly AppDbContext _context;

        public PariService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool succes, string message, Pari? pari)> CreerPari(PariDTO dto)
        {
            // Règle 1 : pas le même pilote deux fois
            if (dto.PiloteP1Id == dto.PiloteP2Id || 
                dto.PiloteP1Id == dto.PiloteP3Id || 
                dto.PiloteP2Id == dto.PiloteP3Id)
                return (false, "Vous ne pouvez pas choisir le même pilote deux fois.", null);

            // Règle 2 : 1 seul pari par utilisateur par GP
            var dejaParié = await _context.Paris
                .AnyAsync(p => p.UtilisateurId == dto.UtilisateurId && p.GrandPrixId == dto.GrandPrixId);
            if (dejaParié)
                return (false, "Vous avez déjà parié sur ce Grand Prix.", null);

            // Règle 3 : clôture 5 minutes avant la course
            var grandPrix = await _context.GrandsPrix.FindAsync(dto.GrandPrixId);
            if (grandPrix == null)
                return (false, "Grand Prix introuvable.", null);
            if (DateTime.UtcNow >= grandPrix.DateCourse.AddMinutes(-5))
                return (false, "Les paris sont clôturés pour ce Grand Prix.", null);

            // Création du pari
            var pari = new Pari
            {
                UtilisateurId = dto.UtilisateurId,
                GrandPrixId = dto.GrandPrixId,
                PiloteP1Id = dto.PiloteP1Id,
                PiloteP2Id = dto.PiloteP2Id,
                PiloteP3Id = dto.PiloteP3Id,
                DatePari = DateTime.UtcNow,
                EstValide = false,
                PointsGagnes = 0
            };

            _context.Paris.Add(pari);
            await _context.SaveChangesAsync();
            return (succes: true, message: "Pari créé avec succès !", pari: pari);
        }

        public async Task<(bool succes, string message)> CalculerPoints(int grandPrixId)
        {
            // Récupérer les résultats officiels du GP
            var resultats = await _context.Resultats
                .Where(r => r.GrandPrixId == grandPrixId)
                .ToListAsync();

            if (resultats.Count < 3)
                return (false, "Les résultats du Grand Prix ne sont pas complets.");

            int vraiP1 = resultats.First(r => r.Position == 1).PiloteId;
            int vraiP2 = resultats.First(r => r.Position == 2).PiloteId;
            int vraiP3 = resultats.First(r => r.Position == 3).PiloteId;

            // Récupérer tous les paris de ce GP
            var paris = await _context.Paris
                .Where(p => p.GrandPrixId == grandPrixId)
                .ToListAsync();

            foreach (var pari in paris)
            {
                int points = 0;

                // Points par position trouvée
                if (pari.PiloteP1Id == vraiP1) points += 10;
                if (pari.PiloteP2Id == vraiP2) points += 7;
                if (pari.PiloteP3Id == vraiP3) points += 5;

                // Bonus tous dans l'ordre
                if (pari.PiloteP1Id == vraiP1 && pari.PiloteP2Id == vraiP2 && pari.PiloteP3Id == vraiP3)
                    points += 15;
                // Bonus tous trouvés mais pas dans l'ordre
                else if (
                    new[] { pari.PiloteP1Id, pari.PiloteP2Id, pari.PiloteP3Id }.OrderBy(x => x)
                    .SequenceEqual(new[] { vraiP1, vraiP2, vraiP3 }.OrderBy(x => x)))
                    points += 7;

                pari.PointsGagnes = points;
                pari.EstValide = true;

                // Ajouter les points à l'utilisateur
                var utilisateur = await _context.Utilisateurs.FindAsync(pari.UtilisateurId);
                if (utilisateur != null)
                    utilisateur.Points += points;
            }

            // Marquer le GP comme terminé
            var gp = await _context.GrandsPrix.FindAsync(grandPrixId);
            if (gp != null) gp.EstTermine = true;

            await _context.SaveChangesAsync();
            return (true, "Points calculés avec succès !");
        }
    }
}