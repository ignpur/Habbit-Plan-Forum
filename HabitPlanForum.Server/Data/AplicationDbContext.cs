using Microsoft.EntityFrameworkCore;

namespace HabitPlanForum.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<HabitPlan> HabitPlans { get; set; }
    }
}
