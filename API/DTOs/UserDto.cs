using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserDto
{
    [Required]
    public string Id { get; set; } = string.Empty;

    // [Required]
    public string FirstName { get; set; } = string.Empty;

    // [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    public AddressDto? Address { get; set; }

    [Required]
    public string? Roles { get; set; }

   
}
