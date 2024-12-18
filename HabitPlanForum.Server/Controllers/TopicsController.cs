﻿using AutoMapper;
using HabitPlanForum.Server.Data;
using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using HabitPlanForum.Server.Auth.Model;
using Microsoft.Extensions.Hosting;

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
    [Authorize(Roles = ForumRoles.ForumUser)]
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
        topic.UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        try
        {
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            var topicDTO = _mapper.Map<TopicDTO>(topic);
            return CreatedAtAction(nameof(GetTopics), new { topicId = topic.Id }, topicDTO);
        }
        catch
        {
            return StatusCode(500, "An internal server error occurred.");
        }
    }

    // PUT: api/topics/{topicId}
    [Authorize]
    [HttpPut("{topicId}")]
    public async Task<IActionResult> UpdateTopic(int topicId, UpdateTopicDTO updateTopicDTO)
    {
        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null)
        {
            return NotFound(); // 404 Not Found
        }
        if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
    HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != topic.UserId)
        {
            return Forbid();
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

    // GET: api/Topics/{topicId}
    [HttpGet("{topicId}")]
    public async Task<ActionResult<IEnumerable<PostDTO>>> GetPostsByTopic(int topicId)
    {
        try
        {
            // Retrieve the topic from the database
            var topic = await _context.Topics
                .FirstOrDefaultAsync(t => t.Id == topicId);

            // Check if the topic exists
            if (topic == null)
            {
                return NotFound(); // 404 Not Found
            }

            // Map the Topic entity to a TopicDTO
            var topicDTO = _mapper.Map<TopicDTO>(topic);

            // Return the topic data
            return Ok(topicDTO); // 200 OK
        }
        catch
        {
            // Handle any server errors
            return StatusCode(500, "An internal server error occurred."); // 500 Internal Server Error
        }
    }

    // DELETE: api/topics/{topicId}
    [Authorize]
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

            //Authorization
            if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
        HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != topic.UserId)
            {
                return Forbid();
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
