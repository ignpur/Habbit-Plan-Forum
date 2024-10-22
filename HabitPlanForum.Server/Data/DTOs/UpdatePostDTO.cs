using System.ComponentModel.DataAnnotations;

namespace HabitPlanForum.Server.Data.DTOs
{
    public class UpdatePostDTO
    {
        [Required]
        [MinLength(3), MaxLength(5000)]
        public string Content { get; set; }
    }
}
