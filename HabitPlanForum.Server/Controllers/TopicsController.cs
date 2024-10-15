using HabitPlanForum.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class TopicsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TopicsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/topics
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Topic>>> GetTopics()
    {
        return await _context.Topics.ToListAsync();
    }

    // POST: api/topics
    [HttpPost]
    public async Task<ActionResult<Topic>> CreateTopic(Topic topic)
    {
        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic);
    }

    // PUT: api/topics/{id} (Update an existing topic)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTopic(int id, Topic updatedTopic)
    {
        if (id != updatedTopic.Id)
        {
            return BadRequest();
        }

        _context.Entry(updatedTopic).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Topics.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // GET: api/topics/{topicId}/posts
    [HttpGet("{topicId}/posts")]
    public async Task<ActionResult<IEnumerable<Post>>> GetPostsByTopic(int topicId)
    {
        var posts = await _context.Posts.Where(p => p.TopicId == topicId).ToListAsync();

        if (posts == null || posts.Count == 0)
        {
            return NotFound();
        }

        return posts;
    }


    // DELETE: api/topics/{id} (Delete a topic by ID)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTopic(int id)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null)
        {
            return NotFound();
        }

        _context.Topics.Remove(topic);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
