using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.Xml;

namespace Backend.Data
{
    public class ApplicationContext: DbContext
    {
        public DbSet<Users> users { get; set; }
        public DbSet<Requests> requests { get; set; }
        public DbSet<Comments> comments { get; set; }
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {

        }
    }
}
