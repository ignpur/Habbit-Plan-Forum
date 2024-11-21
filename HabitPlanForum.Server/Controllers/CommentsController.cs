using AutoMapper;
using HabitPlanForum.Server.Data;
using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using HabitPlanForum.Server.Auth.Model;

[Route("api/Topics/{topicId}/Posts/{postId}/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CommentsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/topics/{topicId}/posts/{postId}/comments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComments(int topicId, int postId)
    {
        try
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .ToListAsync();

            // Use AutoMapper to map Comment to CommentDTO
            var commentDTOs = _mapper.Map<List<CommentDTO>>(comments);

            return Ok(commentDTOs); // 200 OK
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // POST: api/topics/{topicId}/posts/{postId}/comments
    [Authorize(Roles = ForumRoles.ForumUser)]
    [HttpPost]
    public async Task<ActionResult<CommentDTO>> CreateComment(int topicId, int postId, CreateCommentDTO createCommentDTO)
    {
        // Validate input
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

        // Map the CreateCommentDTO to the Comment entity
        var comment = _mapper.Map<Comment>(createCommentDTO);
        comment.PostId = postId;
        comment.CreatedAt = DateTime.UtcNow;
        comment.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        try
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // Map the saved Comment entity to CommentDTO
            var commentDTO = _mapper.Map<CommentDTO>(comment);

            return CreatedAtAction(nameof(GetComments), new { topicId = topicId, postId = postId, commentId = comment.Id }, commentDTO); // 201 Created
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // PUT: api/topics/{topicId}/posts/{postId}/comments/{commentId}
    [Authorize]
    [HttpPut("{commentId}")]
    public async Task<IActionResult> UpdateComment(int topicId, int postId, int commentId, UpdateCommentDTO updateCommentDTO)
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

        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId);
        if (comment == null)
        {
            return NotFound(); // 404 Not Found
        }
        if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
    HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != comment.UserId)
        {
            return Forbid();
        }

        // Use AutoMapper to map the changes from UpdateCommentDTO to the existing Comment entity
        _mapper.Map(updateCommentDTO, comment);

        try
        {
            await _context.SaveChangesAsync();
            return Ok(updateCommentDTO); // 204 No Content
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // DELETE: api/topics/{topicId}/posts/{postId}/comments/{commentId}
    [HttpDelete("{commentId}")]
    public async Task<IActionResult> DeleteComment(int topicId, int postId, int commentId)
    {
        try
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId);
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
