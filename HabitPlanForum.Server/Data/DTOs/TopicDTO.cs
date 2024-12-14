namespace HabitPlanForum.Server.Data.DTOs
{
    public class TopicDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }

        public ICollection<PostDTO> Posts { get; set; }
    }
}
