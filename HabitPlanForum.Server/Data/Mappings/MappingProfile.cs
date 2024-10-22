using HabitPlanForum.Server.Data.DTOs;
using HabitPlanForum.Server.Data.Entities;
using AutoMapper;

namespace HabitPlanForum.Server.Data.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Topic -> DTO Mappings
            CreateMap<Topic, CreateTopicDTO>().ReverseMap(); // CreateTopicDTO to Topic and vice versa
            CreateMap<Topic, UpdateTopicDTO>().ReverseMap(); // UpdateTopicDTO to Topic and vice versa
            CreateMap<Topic, TopicDTO>().ReverseMap();       // TopicDTO to Topic and vice versa

            // Post -> DTO Mappings
            CreateMap<Post, CreatePostDTO>().ReverseMap();
            CreateMap<Post, UpdatePostDTO>().ReverseMap();
            CreateMap<Post, PostDTO>().ReverseMap();

            // Comment -> DTO Mappings
            CreateMap<Comment, CreateCommentDTO>().ReverseMap();
            CreateMap<Comment, UpdateCommentDTO>().ReverseMap();
            CreateMap<Comment, CommentDTO>().ReverseMap();
        }
    }
}
