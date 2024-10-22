using System.ComponentModel.DataAnnotations;

namespace HabitPlanForum.Server.Data.DTOs
{
    public class UpdateCommentDTO
    {
        [Required]
        [MinLength(1), MaxLength(1000)]
        public string Content { get; set; }
    }
}
