using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/topics/{topicId}/posts/{postId}/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CommentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/topics/{topicId}/posts/{postId}/comments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComments(int topicId, int postId)
    {
        try
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .Select(c => new CommentDTO
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    PostId = c.PostId
                })
                .ToListAsync();

            return Ok(comments); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/topics/{topicId}/posts/{postId}/comments
    [HttpPost]
    public async Task<ActionResult<CommentDTO>> CreateComment(int topicId, int postId, CreateCommentDTO createCommentDTO)
    {
        // Validate input (e.g., ensure the comment has valid content)
        if (string.IsNullOrEmpty(createCommentDTO.Content))
        {
            return UnprocessableEntity("Comment content is required."); // 422 Unprocessable Entity
        }

        // Check if the post exists under the given topic
        var postExists = await _context.Posts.AnyAsync(p => p.Id == postId && p.TopicId == topicId);
        if (!postExists)
        {
            return BadRequest("Cannot add a comment to a non-existent post or topic."); // 400 Bad Request
        }

        var comment = new Comment
        {
            Content = createCommentDTO.Content,
            CreatedAt = DateTime.UtcNow,
            PostId = postId
        };

        try
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var commentDTO = new CommentDTO
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                PostId = comment.PostId
            };

            return CreatedAtAction(nameof(GetComments), new { topicId = topicId, postId = postId, id = comment.Id }, commentDTO); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/topics/{topicId}/posts/{postId}/comments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateComment(int topicId, int postId, int id, UpdateCommentDTO updateCommentDTO)
    {
        if (string.IsNullOrEmpty(updateCommentDTO.Content))
        {
            return UnprocessableEntity("Comment content is required."); // 422 Unprocessable Entity
        }

        // Check if the post exists under the given topic
        var postExists = await _context.Posts.AnyAsync(p => p.Id == postId && p.TopicId == topicId);
        if (!postExists)
        {
            return BadRequest("Cannot update a comment under a non-existent post or topic."); // 400 Bad Request
        }

        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id && c.PostId == postId);
        if (comment == null)
        {
            return NotFound(); // 404 Not Found
        }

        comment.Content = updateCommentDTO.Content;

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

    // DELETE: api/topics/{topicId}/posts/{postId}/comments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int topicId, int postId, int id)
    {
        try
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id && c.PostId == postId);
            if (comment == null)
            {
                return NotFound(); // 404 Not Found
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }
}
