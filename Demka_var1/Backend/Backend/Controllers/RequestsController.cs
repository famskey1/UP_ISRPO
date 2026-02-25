using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        ApplicationContext db;
        public RequestsController(ApplicationContext dbb)
        {
            db = dbb;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Requests>>> Get()
        {
            return await db.requests.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Requests>>> Get(int id)
        {
            Requests r = await db.requests.FirstOrDefaultAsync(x => x.requestid == id);
            if (r == null) return NotFound();
            return new ObjectResult(r);
        }

        [HttpPost]
        public async Task<ActionResult<Requests>> Post(Requests requests)
        {
            if (requests == null)
            {
                return BadRequest();
            }
            db.requests.Add(requests);
            await db.SaveChangesAsync();
            return Ok(requests);
        }

        [HttpPatch]
        public async Task<ActionResult<Requests>> Patch(Requests requests)
        {
            if (requests == null)
            {
                return BadRequest();
            }
            if (!db.requests.Any(x => x.requestid == requests.requestid))
            {
                return NotFound();
            }
            db.requests.Update(requests);
            await db.SaveChangesAsync();
            return Ok(requests);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Requests>> Delete(int id)
        {
            Requests r = await db.requests.FirstOrDefaultAsync(x => x.requestid == id);
            if (r == null)
            {
                return BadRequest();
            }
            db.requests.Remove(r);
            await db.SaveChangesAsync();
            return Ok(r);
        }
    }
}
