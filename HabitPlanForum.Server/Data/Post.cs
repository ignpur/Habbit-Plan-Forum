namespace HabitPlanForum.Server.Data
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; }

        public int TopicId { get; set; }
    }
}
