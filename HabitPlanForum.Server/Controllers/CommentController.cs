using HabitPlanForum.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CommentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/comments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
    {
        try
        {
            var comments = await _context.Comments.ToListAsync();
            return Ok(comments); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/comments
    [HttpPost]
    public async Task<ActionResult<Comment>> CreateComment(Comment comment)
    {
        // Validate input (e.g., ensure the comment has valid content)
        if (string.IsNullOrEmpty(comment.Content)) // Assuming "Content" is a field in Comment model
        {
            return UnprocessableEntity("Comment content is required."); // 422 Unprocessable Entity
        }

        try
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetComments), new { id = comment.Id }, comment); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/comments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateComment(int id, Comment updatedComment)
    {
        if (id != updatedComment.Id)
        {
            return BadRequest(); // 400 Bad Request
        }

        if (string.IsNullOrEmpty(updatedComment.Content)) // Validate content
        {
            return UnprocessableEntity("Comment content is required."); // 422 Unprocessable Entity
        }

        _context.Entry(updatedComment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Comments.Any(e => e.Id == id))
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

    // DELETE: api/comments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        try
        {
            var comment = await _context.Comments.FindAsync(id);
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
