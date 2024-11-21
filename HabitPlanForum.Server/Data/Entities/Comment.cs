using HabitPlanForum.Server.Auth.Model;
using Microsoft.Extensions.Hosting;


namespace HabitPlanForum.Server.Data.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }

        public required string UserId { get; set; }
        public ForumUser User { get; set; }
    }
}
