using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotogpApi.Data;
using MotogpApi.DTOs;
using MotogpApi.Models;
using MotogpApi.Services;

namespace MotogpApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParisController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PariService _pariService;

        public ParisController(AppDbContext context, PariService pariService)
        {
            _context = context;
            _pariService = pariService;
        }

        // GET api/paris
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pari>>> GetParis()
        {
            return await _context.Paris
                .Include(p => p.Utilisateur)
                .Include(p => p.GrandPrix)
                .Include(p => p.PiloteP1)
                .Include(p => p.PiloteP2)
                .Include(p => p.PiloteP3)
                .ToListAsync();
        }

        // GET api/paris/utilisateur/1
        [HttpGet("utilisateur/{utilisateurId}")]
        public async Task<ActionResult<IEnumerable<Pari>>> GetParisByUtilisateur(int utilisateurId)
        {
            return await _context.Paris
                .Where(p => p.UtilisateurId == utilisateurId)
                .Include(p => p.GrandPrix)
                .Include(p => p.PiloteP1)
                .Include(p => p.PiloteP2)
                .Include(p => p.PiloteP3)
                .ToListAsync();
        }

        // POST api/paris
        [HttpPost]
        public async Task<IActionResult> CreatePari(PariDTO dto)
        {
            var (succes, message, pari) = await _pariService.CreerPari(dto);
            if (!succes) return BadRequest(message);
            return CreatedAtAction(nameof(GetParis), new { id = pari!.Id }, pari);
        }

        // POST api/paris/calculer/1
        [HttpPost("calculer/{grandPrixId}")]
        public async Task<IActionResult> CalculerPoints(int grandPrixId)
        {
            var (succes, message) = await _pariService.CalculerPoints(grandPrixId);
            if (!succes) return BadRequest(message);
            return Ok(message);
        }

        // PUT api/paris/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePari(int id, PariDTO dto)
        {
            var pari = await _context.Paris.FindAsync(id);
            if (pari == null) return NotFound("Pari introuvable");
            if (pari.EstValide) return BadRequest("Ce pari a déjà été validé, impossible de le modifier");

            pari.PiloteP1Id = dto.PiloteP1Id;
            pari.PiloteP2Id = dto.PiloteP2Id;
            pari.PiloteP3Id = dto.PiloteP3Id;

            await _context.SaveChangesAsync();
            return Ok("Pari modifié !");
        }
    }
}