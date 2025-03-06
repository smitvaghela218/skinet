using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using FileUploader.App.Concrete;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


public class ProductsController(IUnitOfWork unit) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts
        ([FromQuery] ProductSpecParams specParams)
    {

        var spec = new ProductSpecification(specParams);

        return await CreatePagedResult(unit.Repository<Product>(), spec, specParams.PageIndex, specParams.PageSize);
    }

    private bool ProductExists(int id)
    {
        return unit.Repository<Product>().Exists(id);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null)
            return NotFound();

        return product;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] Product product, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(file.FileName).ToLower();

        if (!allowedExtensions.Contains(fileExtension))
            return BadRequest("Invalid file type. Allowed formats: jpg, jpeg, png.");

        long maxFileSize = 2 * 1024 * 1024; // 5MB
        if (file.Length > maxFileSize)
            return BadRequest("File size exceeds the 2MB limit.");

        string fileName = $"{Guid.NewGuid()}";

        bool uploadSuccess = await FileUploaderOperations.UploadFile(file, fileName, @"images/products");

        if (!uploadSuccess)
            return BadRequest("File upload failed.");

        product.PictureUrl = $"{fileName}{file.FileName}";

        unit.Repository<Product>().Add(product);
        await unit.Complete();

        return Ok(product);
    }




    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromForm] Product product, IFormFile? file)
    {
        if (product.Id != id || !ProductExists(id))
        {
            return BadRequest("Cannot update this product");
        }

        // unit.Repository<Product>().Entry(product).State = EntityState.Modified;

        var existingProduct = await unit.Repository<Product>().GetByIdAsync(id);
        if (existingProduct == null)
        {
            return NotFound("Product not found");
        }

        if (file != null && file.Length > 0)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Allowed formats: jpg, jpeg, png.");
            }

            long maxFileSize = 2 * 1024 * 1024; // 2MB
            if (file.Length > maxFileSize)
            {
                return BadRequest("File size exceeds the 2MB limit.");
            }

            string fileName = $"{Guid.NewGuid()}";
            bool uploadSuccess = await FileUploaderOperations.UpdateFile(file, fileName, @"images/products", existingProduct.PictureUrl);

            if (!uploadSuccess)
            {
                return BadRequest("File update failed.");
            }
            else
            {
                System.Console.WriteLine("-------------------------------------------------------------------");
                System.Console.WriteLine("existingProduct.PictureUrl " + existingProduct.PictureUrl);
                System.Console.WriteLine("-------------------------------------------------------------------");
            }

            existingProduct.PictureUrl = $"{fileName}{file.FileName}";
        }

        existingProduct.Name = product.Name;
        existingProduct.Description = product.Description;
        existingProduct.Price = product.Price;
        existingProduct.Type = product.Type;
        existingProduct.Brand = product.Brand;
        existingProduct.QuantityInStock = product.QuantityInStock;


        unit.Repository<Product>().Update(existingProduct);

        // await unit.Repository<Product>().SaveChangesAsync();

        if (await unit.Complete())
        {
            return NoContent();
        }

        return BadRequest("Problem updating the product");

        // return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null)
            return NotFound();

        if (product.PictureUrl != null)
        {
            bool deleteSuccess = await FileUploaderOperations.DeleteFile(product.PictureUrl, @"images/products");
            if (!deleteSuccess)
            {
                return BadRequest("Problem deleting the product Image");
            }

        }
        else
        {
            return BadRequest("product Image Not Found");
        }

        unit.Repository<Product>().Remove(product);

        if (await unit.Complete())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting the product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }
}