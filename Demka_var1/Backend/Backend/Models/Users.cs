using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int userid { get; set; }
        public string fio { get; set; }
        public string phone { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string type { get; set; }
        
    }
}
