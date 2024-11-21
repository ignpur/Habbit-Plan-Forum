using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitPlanForum.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Topics_AspNetUsers_UserID",
                table: "Topics");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Topics",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Topics_UserID",
                table: "Topics",
                newName: "IX_Topics_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_AspNetUsers_UserId",
                table: "Topics",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Topics_AspNetUsers_UserId",
                table: "Topics");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Topics",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Topics_UserId",
                table: "Topics",
                newName: "IX_Topics_UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_AspNetUsers_UserID",
                table: "Topics",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
