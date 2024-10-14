using HabitPlanForum.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TopicsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TopicsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Topic>>> GetTopics()
    {
        return await _context.Topics.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Topic>> CreateTopic(Topic topic)
    {
        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic);
    }
}
