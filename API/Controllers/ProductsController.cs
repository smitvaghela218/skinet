using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts
        (string? brand, string? type, string? sort)
    {
        var spec = new ProductSpecification(brand, type, sort);
        var products = await repo.ListAsync(spec);
        return Ok(products);
    }

    private bool ProductExists(int id)
    {
        return repo.Exists(id);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        repo.Add(product);

        await repo.SaveAllAsync();

        return product;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !ProductExists(id))
        {
            return BadRequest("Cannot update this product");
        }

        // repo.Entry(product).State = EntityState.Modified;

        repo.Update(product);

        // await repo.SaveChangesAsync();

        if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem updating the product");

        // return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        repo.Remove(product);

        if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting the product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();
        return Ok(await repo.ListAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
         var spec = new TypeListSpecification();
        return Ok(await repo.ListAsync(spec));
    }
}