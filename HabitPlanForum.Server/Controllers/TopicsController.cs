using AutoMapper;
using HabitPlanForum.Server.Data;
using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class TopicsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public TopicsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/topics
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TopicDTO>>> GetTopics()
    {
        try
        {
            var topics = await _context.Topics.ToListAsync();
            var topicsDTO = _mapper.Map<List<TopicDTO>>(topics);  // AutoMapper
            return Ok(topicsDTO); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/topics
    [HttpPost]
    [Produces("application/json")] // Define the content type Swagger will display
    public async Task<ActionResult<TopicDTO>> CreateTopic(CreateTopicDTO createTopicDTO)
    {
        if (string.IsNullOrEmpty(createTopicDTO.Title))
        {
            return UnprocessableEntity("Topic title is required.");
        }

        var topic = _mapper.Map<Topic>(createTopicDTO);
        topic.CreatedAt = DateTime.UtcNow;

        try
        {
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            var topicDTO = _mapper.Map<TopicDTO>(topic);
            return CreatedAtAction(nameof(GetTopics), new { topicId = topic.Id }, topicDTO); // Changed `id` to `topicId`
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred.");
        }
    }

    // PUT: api/topics/{topicId}
    [HttpPut("{topicId}")]
    public async Task<IActionResult> UpdateTopic(int topicId, UpdateTopicDTO updateTopicDTO)
    {
        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null)
        {
            return NotFound(); // 404 Not Found
        }

        // Map updated fields from DTO to existing entity using AutoMapper
        _mapper.Map(updateTopicDTO, topic);

        try
        {
            await _context.SaveChangesAsync();
            return NoContent(); // 204 No Content
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // GET: api/Topics/{topicId}/Posts
    [HttpGet("{topicId}/related-posts")]
    public async Task<ActionResult<IEnumerable<PostDTO>>> GetPostsByTopic(int topicId)
    {
        try
        {
            var posts = await _context.Posts
                .Where(p => p.TopicId == topicId)
                .ToListAsync();

            if (posts == null || posts.Count == 0)
            {
                return NotFound(); // 404 Not Found
            }

            var postDTOs = _mapper.Map<List<PostDTO>>(posts);
            return Ok(postDTOs); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // DELETE: api/topics/{topicId}
    [HttpDelete("{topicId}")]
    public async Task<IActionResult> DeleteTopic(int topicId)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(topicId);
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
