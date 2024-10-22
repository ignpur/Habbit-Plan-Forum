using System.ComponentModel.DataAnnotations;

namespace HabitPlanForum.Server.Data.DTOs
{
    public class UpdateTopicDTO
    {
        [Required]
        [MinLength(3), MaxLength(500)]
        public string Description { get; set; }
    }
}
