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
        try
        {
            var topics = await _context.Topics.ToListAsync();
            return Ok(topics); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/topics
    [HttpPost]
    public async Task<ActionResult<Topic>> CreateTopic(Topic topic)
    {
        if (string.IsNullOrEmpty(topic.Title)) // Assuming Topic has a 'Title' field
        {
            return UnprocessableEntity("Topic title is required."); // 422 Unprocessable Entity
        }

        try
        {
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/topics/{id} (Update an existing topic)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTopic(int id, Topic updatedTopic)
    {
        if (id != updatedTopic.Id)
        {
            return BadRequest(); // 400 Bad Request
        }

        if (string.IsNullOrEmpty(updatedTopic.Title)) // Assuming Topic has a 'Title' field
        {
            return UnprocessableEntity("Topic title is required."); // 422 Unprocessable Entity
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
                return NotFound(); // 404 Not Found
            }
            else
            {
                return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
            }
        }

        return NoContent(); // 204 No Content
    }

    // GET: api/topics/{topicId}/posts
    [HttpGet("{topicId}/posts")]
    public async Task<ActionResult<IEnumerable<Post>>> GetPostsByTopic(int topicId)
    {
        try
        {
            var posts = await _context.Posts.Where(p => p.TopicId == topicId).ToListAsync();

            if (posts == null || posts.Count == 0)
            {
                return NotFound(); // 404 Not Found
            }

            return Ok(posts); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // DELETE: api/topics/{id} (Delete a topic by ID)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTopic(int id)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
            {
                return NotFound(); // 404 Not Found
            }

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }
}
