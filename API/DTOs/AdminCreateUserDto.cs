using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AdminCreateUserDto
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Customer|Admin)$", ErrorMessage = "Role must be either 'Customer' or 'Admin'")]
    public required string Role { get; set; } // Admin chooses role
}
