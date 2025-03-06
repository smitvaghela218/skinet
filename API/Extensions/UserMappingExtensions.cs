using System;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class UserMappingExtensions
{

    public static async Task<UserDto> ToDto(this AppUser user, UserManager<AppUser> userManager)
    {
        var roles = await userManager.GetRolesAsync(user);

        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Address = user.Address?.ToDto() ?? null,
            Roles = roles.ToList()[0]
        };
    }
}
