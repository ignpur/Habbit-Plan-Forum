using HabitPlanForum.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using HabitPlanForum.Server.Auth.Model;


namespace HabitPlanForum.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ForumUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }
        //private readonly IConfiguration _configuration;
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Session> Sessions { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define relationships and configurations
            modelBuilder.Entity<Topic>()
               .HasOne(t => t.User)
               .WithMany(u => u.Topics)
               .HasForeignKey(t => t.UserId)
               .OnDelete(DeleteBehavior.Restrict); // Prevent user deletion from cascading

            // Topic -> Posts (Cascade delete)
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Topic)
                .WithMany(t => t.Posts)
                .HasForeignKey(p => p.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            // Define relationship between Post and ForumUser
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Post -> Comments (Cascade delete)
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // Define relationship between Comment and ForumUser
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
