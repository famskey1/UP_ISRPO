using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Requests
    {
        [Key]
        public int requestid { get; set; }
        public DateOnly startdate { get; set; }
        public string hometechtype { get; set; }
        public string hometechmodel { get; set; }
        public string problemdescryption { get; set; }
        public string requeststatus { get; set; }
        public DateOnly? completiondate { get; set; }
        public string? repairparts { get; set; }
        public int? masterid { get; set; }
        public int clientid { get; set; }
    }
}
