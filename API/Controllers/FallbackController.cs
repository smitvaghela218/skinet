using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FallbackController : Controller
    {

        public IActionResult Index()
        {
            // System.Console.WriteLine("-------------------------------------------------------------------------------------------------------");
            // System.Console.WriteLine(" Directory.GetCurrentDirectory() "+Directory.GetCurrentDirectory()); //
            // Directory.GetCurrentDirectory() E:\.net+anguler\demo\skinet\API
            // System.Console.WriteLine("-------------------------------------------------------------------------------------------------------");

            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot", "index.html"), "text/HTML");
        }
    }
}
