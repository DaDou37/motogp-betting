using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotogpApi.Data;
using MotogpApi.Models;

namespace MotogpApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PilotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PilotesController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/pilotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pilote>>> GetPilotes()
        {
            return await _context.Pilotes.ToListAsync();
        }

        // GET api/pilotes/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Pilote>> GetPilote(int id)
        {
            var pilote = await _context.Pilotes.FindAsync(id);
            if (pilote == null) return NotFound();
            return pilote;
        }

        // POST api/pilotes
        [HttpPost]
        public async Task<ActionResult<Pilote>> CreatePilote(Pilote pilote)
        {
            _context.Pilotes.Add(pilote);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPilote), new { id = pilote.Id }, pilote);
        }

        // PUT api/pilotes/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePilote(int id, Pilote pilote)
        {
            if (id != pilote.Id) return BadRequest();
            _context.Entry(pilote).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/pilotes/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePilote(int id)
        {
            var pilote = await _context.Pilotes.FindAsync(id);
            if (pilote == null) return NotFound();
            _context.Pilotes.Remove(pilote);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}