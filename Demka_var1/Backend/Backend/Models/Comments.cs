using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Comments
    {
        [Key]
        public int commentid { get; set; }
        public string message { get; set; }
        public int masterid { get; set; }
        public int requestid { get; set; } 
    }
}
