﻿using HabitPlanForum.Server.Auth.Model;
using Microsoft.AspNetCore.Identity;

namespace HabitPlanForum.Server.Auth
{
    public class AuthSeeder
    {
        private readonly UserManager<ForumUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AuthSeeder(UserManager<ForumUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task SeedAsync()
        {
            await AddDefaultRolesAsync();
            await AddAdminUserAsync();
        }
        private async Task AddAdminUserAsync()
        {
            var newAdminUser = new ForumUser()
            {
                UserName = "admin",
                Email = "admin@admin.com"
            };
            var existsAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (existsAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "AdminUserPassword1!");
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(newAdminUser, ForumRoles.All);
                }
            }
        }
        private async Task AddDefaultRolesAsync()
        {
            foreach (var role in ForumRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
