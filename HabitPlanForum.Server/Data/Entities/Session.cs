﻿using HabitPlanForum.Server.Auth.Model;
using System.ComponentModel.DataAnnotations;

namespace HabitPlanForum.Server.Data.Entities
{
    public class Session
    {
        public Guid Id { get; set; }
        public string LastRefreshToken { get; set; }
        public DateTimeOffset InitiatedAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }

        [Required]
        public required string UserId { get; set; }

        public ForumUser User { get; set; }
    }
}
