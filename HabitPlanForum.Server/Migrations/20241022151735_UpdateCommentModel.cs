using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitPlanForum.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCommentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateIndex(
            //    name: "IX_Posts_TopicId",
            //    table: "Posts",
            //    column: "TopicId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Comments_PostId",
            //    table: "Comments",
            //    column: "PostId");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Comments_Posts_PostId",
            //    table: "Comments",
            //    column: "PostId",
            //    principalTable: "Posts",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Posts_Topics_TopicId",
            //    table: "Posts",
            //    column: "TopicId",
            //    principalTable: "Topics",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Topics_TopicId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_TopicId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Comments_PostId",
                table: "Comments");
        }
    }
}
