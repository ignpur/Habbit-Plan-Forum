using AutoMapper;
using HabitPlanForum.Server.Data;
using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/topics/{topicId}/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PostsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/topics/{topicId}/posts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDTO>>> GetPosts(int topicId)
    {
        try
        {
            var posts = await _context.Posts
                .Where(p => p.TopicId == topicId)
                .ToListAsync();

            // Use AutoMapper to map Post to PostDTO
            var postsDTO = _mapper.Map<List<PostDTO>>(posts);

            return Ok(postsDTO); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // GET: api/topics/{topicId}/posts/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<PostDTO>> GetPost(int topicId, int id)
    {
        try
        {
            var post = await _context.Posts
                .Where(p => p.Id == id && p.TopicId == topicId)
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound(); // 404 Not Found
            }

            // Map Post to PostDTO using AutoMapper
            var postDTO = _mapper.Map<PostDTO>(post);

            return Ok(postDTO); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/topics/{topicId}/posts
    [HttpPost]
    public async Task<ActionResult<PostDTO>> CreatePost(int topicId, CreatePostDTO createPostDTO)
    {
        if (string.IsNullOrEmpty(createPostDTO.Content))
        {
            return UnprocessableEntity("Post content is required."); // 422 Unprocessable Entity
        }

        // Check if the topic exists before creating the post
        var topicExists = await _context.Topics.AnyAsync(t => t.Id == topicId);
        if (!topicExists)
        {
            return BadRequest("Cannot add a post to a non-existent topic."); // 400 Bad Request
        }

        // Use AutoMapper to map CreatePostDTO to Post entity
        var post = _mapper.Map<Post>(createPostDTO);
        post.TopicId = topicId;
        post.CreatedAt = DateTime.UtcNow;

        try
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Map the newly created Post entity to PostDTO
            var postDTO = _mapper.Map<PostDTO>(post);

            return CreatedAtAction(nameof(GetPost), new { topicId = topicId, id = post.Id }, postDTO); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/topics/{topicId}/posts/{id}/like
    [HttpPut("{id}/like")]
    public async Task<IActionResult> LikePost(int topicId, int id)
    {
        try
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id && p.TopicId == topicId);
            if (post == null)
            {
                return NotFound(); // 404 Not Found
            }

            // Increment the like count
            post.Likes += 1;

            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/topics/{topicId}/posts/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int topicId, int id, UpdatePostDTO updatePostDTO)
    {
        if (string.IsNullOrEmpty(updatePostDTO.Content)) // Validate content
        {
            return UnprocessableEntity("Post content is required."); // 422 Unprocessable Entity
        }

        var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id && p.TopicId == topicId);
        if (post == null)
        {
            return NotFound(); // 404 Not Found
        }

        // Map the changes from UpdatePostDTO to the existing post entity using AutoMapper
        _mapper.Map(updatePostDTO, post);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }

        return NoContent(); // 204 No Content
    }

    // DELETE: api/topics/{topicId}/posts/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int topicId, int id)
    {
        try
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id && p.TopicId == topicId);
            if (post == null)
            {
                return NotFound(); // 404 Not Found
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }
}
