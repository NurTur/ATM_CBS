using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Pawnshop.Web.Engine.Middleware
{
    public class BranchContextMiddleware
    {
        private const string BranchHeader = "Branch";
        private readonly RequestDelegate _next;

        public BranchContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            StringValues branchValues;
            int brachId;
            if (context?.Request != null &&
                context.Request.Headers.TryGetValue(BranchHeader, out branchValues) &&
                branchValues.Count > 0 && int.TryParse(branchValues.First(), out brachId))
            {
                var scope = (ILifetimeScope)context.RequestServices.GetService(typeof(ILifetimeScope));
                var configurationContext = scope.Resolve<BranchContext>();
                configurationContext.Init(brachId);
            }

            await _next.Invoke(context);
        }
    }
}