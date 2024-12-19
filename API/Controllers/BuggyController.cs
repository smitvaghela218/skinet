using System;
using System.Security.Claims;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("badrequest")]
    public IActionResult GetBadrequest()
    {
        return BadRequest("Not a good Request");
    }

    [HttpGet("notfound")]
    public IActionResult GetNotfound()
    {
        return NotFound();
    }

    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("This is a test exception");
    }

    [HttpPost("validationerror")]
    public IActionResult GetValidationError(Product product)
    {
        return Ok();
    }

    [Authorize]
    [HttpGet("secret")]
    public IActionResult GetSecret()
    {
        var name = User.FindFirst(ClaimTypes.Name)?.Value; // return object 
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier); // return value
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"Key: {claim.Type}, Value: {claim.Value}");
        }

        return Ok("Hello " + name + " with the id of " + id);
    }

}
