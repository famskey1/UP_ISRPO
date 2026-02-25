using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        ApplicationContext db;
        IConfiguration configuration;
        public UsersController(ApplicationContext dbb, IConfiguration conf)
        {
            db = dbb;
            configuration = conf;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> Get()
        {
            return await db.users.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Users>>> Get(int id)
        {
            Users u = await db.users.FirstOrDefaultAsync(x => x.userid == id);
            if (u == null) return NotFound();
            return new ObjectResult(u);
        }

        [HttpPost]
        public async Task<ActionResult<Users>> Post(Users users)
        {
            if (users == null)
            {
                return BadRequest();
            }
            db.users.Add(users);
            await db.SaveChangesAsync();
            return Ok(users);
        }

        [Route("login")]
        public async Task<ActionResult<Users>> Login(LoginPass login)
        {
            Users u = await db.users.FirstOrDefaultAsync(x => x.password == login.password && x.login == login.login);
            if (u != null)
            {
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, configuration["JWT:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("userid", u.userid.ToString())
            };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
                var signIN = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    configuration["JWT:Issuer"],
                    configuration["JWT:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: signIN
                    );
                string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new { Token = tokenValue, Users = u });
            }
            ;
            return Unauthorized();
        }

        [HttpPut]
        public async Task<ActionResult<Users>> Patch(Users users)
        {
            if (users == null)
            {
                return BadRequest();
            }
            if (!db.users.Any(x => x.userid == users.userid))
            {
                return NotFound();
            }
            db.users.Update(users);
            await db.SaveChangesAsync();
            return Ok(users);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Users>> Delete(int id)
        {
            Users u = await db.users.FirstOrDefaultAsync(x => x.userid == id);
            if (u == null)
            {
                return BadRequest();
            }
            db.users.Remove(u);
            await db.SaveChangesAsync();
            return Ok(u);
        }
    }
}
