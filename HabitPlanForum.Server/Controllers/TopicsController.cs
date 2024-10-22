using HabitPlanForum.Server.Data;
using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
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
    public async Task<ActionResult<IEnumerable<TopicDTO>>> GetTopics()
    {
        try
        {
            var topics = await _context.Topics
                .Select(t => new TopicDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(topics); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/topics
    [HttpPost]
    public async Task<ActionResult<TopicDTO>> CreateTopic(CreateTopicDTO createTopicDTO)
    {
        if (string.IsNullOrEmpty(createTopicDTO.Title))
        {
            return UnprocessableEntity("Topic title is required."); // 422 Unprocessable Entity
        }

        var topic = new Topic
        {
            Title = createTopicDTO.Title,
            Description = createTopicDTO.Description,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            var topicDTO = new TopicDTO
            {
                Id = topic.Id,
                Title = topic.Title,
                Description = topic.Description,
                CreatedAt = topic.CreatedAt
            };

            return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topicDTO); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/topics/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTopic(int id, UpdateTopicDTO updateTopicDTO)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null)
        {
            return NotFound(); // 404 Not Found
        }

        // Update only the Description field
        topic.Description = updateTopicDTO.Description;

        try
        {
            await _context.SaveChangesAsync();
            return NoContent(); // 204 No Content
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // GET: api/topics/{topicId}/posts
    [HttpGet("{topicId}/posts")]
    public async Task<ActionResult<IEnumerable<PostDTO>>> GetPostsByTopic(int topicId)
    {
        try
        {
            var posts = await _context.Posts
                .Where(p => p.TopicId == topicId)
                .Select(p => new PostDTO
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    CreatedAt = p.CreatedAt,
                })
                .ToListAsync();

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

    // DELETE: api/topics/{id}
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

