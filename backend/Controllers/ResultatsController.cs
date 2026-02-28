using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotogpApi.Data;
using MotogpApi.Models;
using MotogpApi.DTOs;

namespace MotogpApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ResultatsController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/resultats
        [HttpPost]
        public async Task<IActionResult> SaisirResultats([FromBody] ResultatDTO dto)
        {
            // Vérifier que le GP existe
            var gp = await _context.GrandsPrix.FindAsync(dto.GrandPrixId);
            if (gp == null) return NotFound("Grand Prix introuvable");

            // Supprimer les anciens résultats si on re-saisit
            var anciensResultats = _context.Resultats.Where(r => r.GrandPrixId == dto.GrandPrixId);
            _context.Resultats.RemoveRange(anciensResultats);

            // Ajouter les nouveaux résultats
            _context.Resultats.AddRange(new[]
            {
                new Resultat { GrandPrixId = dto.GrandPrixId, PiloteId = dto.PiloteP1Id, Position = 1 },
                new Resultat { GrandPrixId = dto.GrandPrixId, PiloteId = dto.PiloteP2Id, Position = 2 },
                new Resultat { GrandPrixId = dto.GrandPrixId, PiloteId = dto.PiloteP3Id, Position = 3 },
            });

            // Marquer le GP comme terminé
            gp.EstTermine = true;

            await _context.SaveChangesAsync();
            return Ok("Résultats enregistrés !");
        }
    }
}