using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Users
    {
        [Key]
        public int userid { get; set; }
        public string fio { get; set; }
        public string phone { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string type { get; set; }
        
    }
}
