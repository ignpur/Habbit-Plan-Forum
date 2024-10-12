using HabitPlanForum.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitPlanForum.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabitPlansController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HabitPlansController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitPlan>>> GetHabits()
        {
            return await _context.HabitPlans.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<HabitPlan>> CreateHabit(HabitPlan habitPlan)
        {
            _context.HabitPlans.Add(habitPlan);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHabits), new { id = habitPlan.Id }, habitPlan);
        }
    }

}
