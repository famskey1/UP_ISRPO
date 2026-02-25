using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.Xml;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        ApplicationContext db;
        public CommentsController(ApplicationContext dbb)
        {
            db = dbb;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comments>>> Get()
        {
            return await db.comments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Comments>>> Get(int id)
        {
            Comments c = await db.comments.FirstOrDefaultAsync(x => x.commentid == id);
            if (c == null) return NotFound();
            return new ObjectResult(c);
        }

        [HttpPost]
        public async Task<ActionResult<Comments>> Post(Comments comments)
        {
            if (comments == null)
            {
                return BadRequest();
            }
            db.comments.Add(comments);
            await db.SaveChangesAsync();
            return Ok(comments);
        }

        [HttpPatch]
        public async Task<ActionResult<Comments>> Patch(Comments comments)
        {
            if (comments == null)
            {
                return BadRequest();
            }
            if (!db.comments.Any(x => x.commentid == comments.commentid))
            {
                return NotFound();
            }
            db.comments.Update(comments);
            await db.SaveChangesAsync();
            return Ok(comments);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Comments>> Delete(int id)
        {
            Comments c = await db.comments.FirstOrDefaultAsync(x => x.commentid == id);
            if (c == null)
            {
                return BadRequest();
            }
            db.comments.Remove(c);
            await db.SaveChangesAsync();
            return Ok(c);
        }
    }
}
