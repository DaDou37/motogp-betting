using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotogpApi.Data;
using MotogpApi.Models;

namespace MotogpApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GrandsPrixController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GrandsPrixController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/grandsprix
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GrandPrix>>> GetGrandsPrix()
        {
            return await _context.GrandsPrix
                .Include(g => g.Resultats)
                .ThenInclude(r => r.Pilote)
                .ToListAsync();
        }

        // GET api/grandsprix/1
        [HttpGet("{id}")]
        public async Task<ActionResult<GrandPrix>> GetGrandPrix(int id)
        {
            var grandPrix = await _context.GrandsPrix
                .Include(g => g.Resultats)
                .ThenInclude(r => r.Pilote)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (grandPrix == null) return NotFound();
            return grandPrix;
        }

        // POST api/grandsprix
        [HttpPost]
        public async Task<ActionResult<GrandPrix>> CreateGrandPrix(GrandPrix grandPrix)
        {
            _context.GrandsPrix.Add(grandPrix);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGrandPrix), new { id = grandPrix.Id }, grandPrix);
        }

        // PUT api/grandsprix/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGrandPrix(int id, GrandPrix grandPrix)
        {
            if (id != grandPrix.Id) return BadRequest();
            _context.Entry(grandPrix).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}