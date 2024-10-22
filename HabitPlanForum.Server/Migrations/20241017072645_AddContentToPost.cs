using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitPlanForum.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddContentToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Body",
                table: "Posts",
                newName: "Content");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Posts",
                newName: "Body");
        }
    }
}
