﻿using HabitPlanForum.Server.Auth.Model;
using Microsoft.Extensions.Hosting;

namespace HabitPlanForum.Server.Data.Entities
{
    public class Topic
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Post> Posts { get; set; }

        public required string UserId { get; set; }
        public ForumUser User { get; set; }
    }
}
