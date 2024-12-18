﻿using HabitPlanForum.Server.Auth.Model;
using Microsoft.Extensions.Hosting;

namespace HabitPlanForum.Server.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Likes { get; set; }

        public int TopicId { get; set; }
        public Topic Topic { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public required string UserId { get; set; }
        public ForumUser User { get; set; }
    }
}
