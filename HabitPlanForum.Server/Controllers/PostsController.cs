using HabitPlanForum.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PostsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/posts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
    {
        try
        {
            var posts = await _context.Posts.ToListAsync();
            return Ok(posts); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // GET: api/posts/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPost(int id)
    {
        try
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound(); // 404 Not Found
            }

            return Ok(post); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/posts
    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost(Post post)
    {
        // Validate the input (e.g., ensure the post has valid content)
        if (string.IsNullOrEmpty(post.Content))
        {
            return UnprocessableEntity("Post content is required."); // 422 Unprocessable Entity
        }

        try
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/posts/{id}/like
    [HttpPut("{id}/like")]
    public async Task<IActionResult> LikePost(int id)
    {
        try
        {
            var post = await _context.Posts.FindAsync(id);
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

    // PUT: api/posts/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, Post updatedPost)
    {
        if (id != updatedPost.Id)
        {
            return BadRequest(); // 400 Bad Request
        }

        if (string.IsNullOrEmpty(updatedPost.Content)) // Validate content
        {
            return UnprocessableEntity("Post content is required."); // 422 Unprocessable Entity
        }

        _context.Entry(updatedPost).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Posts.Any(e => e.Id == id))
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

    // DELETE: api/posts/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        try
        {
            var post = await _context.Posts.FindAsync(id);
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
