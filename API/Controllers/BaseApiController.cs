using System.Security.Claims;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class BaseApiController : ControllerBase
{
    protected async Task<ActionResult> CreatePagedResult<T>(IGenericRepository<T> repo,
         ISpecification<T> spec, int pageIndex, int pageSize) where T : BaseEntity
    {
        var items = await repo.ListAsync(spec);
        var count = await repo.CountAsync(spec);

        var pagination = new Pagination<T>(pageIndex, pageSize, count, items);

        return Ok(pagination);
    }

    protected async Task<ActionResult> CreatePagedResult<T, TDto>(IGenericRepository<T> repo,
        ISpecification<T> spec, int pageIndex, int pageSize, Func<T, TDto> toDto) where T
            : BaseEntity, IDtoConvertible
    {
        var items = await repo.ListAsync(spec);
        var count = await repo.CountAsync(spec);

        var dtoItems = items.Select(toDto).ToList();

        var pagination = new Pagination<TDto>(pageIndex, pageSize, count, dtoItems);

        return Ok(pagination);
    }
    protected async Task<ActionResult> CreatePagedResult<T, TDto>(
    IQueryable<T> query,
    int pageIndex,
    int pageSize,
    Func<T, Task<TDto>> selector) where T : IdentityUser
    {
        var items = await query.Skip((pageIndex - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        var totalCount = await query.CountAsync();

        // Convert synchronous projection to asynchronous
        var dtoItems = await Task.WhenAll(items.Select(selector));

        var pagination = new Pagination<TDto>(pageIndex, pageSize, totalCount, dtoItems.ToList());
        return Ok(pagination);
    }



}
