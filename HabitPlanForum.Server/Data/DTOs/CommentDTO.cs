namespace HabitPlanForum.Server.Data.DTOs
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int PostId { get; set; }
        public string UserId { get; set; }

    }
}
