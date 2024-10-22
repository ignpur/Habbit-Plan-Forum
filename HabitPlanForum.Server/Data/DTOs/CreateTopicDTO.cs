using System.ComponentModel.DataAnnotations;

namespace HabitPlanForum.Server.Data.DTOs
{
    public class CreateTopicDTO
    {
        [Required]
        [MinLength(2), MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MinLength(3), MaxLength(500)]
        public string Description { get; set; }
    }
}
