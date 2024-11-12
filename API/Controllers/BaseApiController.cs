using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class BaseApiController : ControllerBase
{
    protected async Task<ActionResult> CreatePagedResult<T>(
        IGenericRepository<T> repo,
        ISpecification<T> spec,
        int Pageindex,
        int PageSize
    ) where T : BaseEntity
    {
        var products = await repo.ListAsync(spec);
        var count = await repo.CountAsync(spec);
        var pagination = new Pagination<T>(Pageindex, PageSize, count, products);
        return Ok(pagination);
    }
}
