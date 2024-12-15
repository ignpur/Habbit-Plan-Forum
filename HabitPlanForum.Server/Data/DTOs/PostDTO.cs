namespace HabitPlanForum.Server.Data.DTOs
{
    public class PostDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Likes { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TopicId { get; set; }
        public string UserId { get; set; }
        public ICollection<CommentDTO> Comments { get; set; }
    }
}
