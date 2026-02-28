using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotogpApi.Data;
using MotogpApi.DTOs;
using MotogpApi.Services;

namespace MotogpApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UtilisateursController : ControllerBase
    {
        private readonly UtilisateurService _utilisateurService;
        private readonly AppDbContext _context;

        public UtilisateursController(UtilisateurService utilisateurService, AppDbContext context)
        {
            _utilisateurService = utilisateurService;
            _context = context;
        }

        // POST api/utilisateurs/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var (succes, message) = await _utilisateurService.Register(dto);
            if (!succes) return BadRequest(message);
            return Ok(message);
        }

        // POST api/utilisateurs/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var (succes, message, response) = await _utilisateurService.Login(dto);
            if (!succes) return BadRequest(message);
            return Ok(response);
        }

        // GET api/utilisateurs/classement
        [HttpGet("classement")]
        public async Task<IActionResult> GetClassement()
        {
            var classement = await _context.Utilisateurs
                .Where(u => !u.EstAdmin)
                .OrderByDescending(u => u.Points)
                .Select(u => new
                {
                    u.Id,
                    u.Pseudo,
                    u.Points,
                    NombreParis = _context.Paris.Count(p => p.UtilisateurId == u.Id)
                })
                .ToListAsync();

            return Ok(classement);
        }
    }
}