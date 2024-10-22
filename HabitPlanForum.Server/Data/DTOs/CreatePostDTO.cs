using System.ComponentModel.DataAnnotations;

namespace HabitPlanForum.Server.Data.DTOs
{
    public class CreatePostDTO
    {
        [Required]
        [MinLength(2), MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MinLength(3), MaxLength(5000)]
        public string Content { get; set; }
    }
}
