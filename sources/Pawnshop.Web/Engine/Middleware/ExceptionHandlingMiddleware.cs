using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Pawnshop.Core.Exceptions;

namespace Pawnshop.Web.Engine.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (PawnshopApplicationException ex)
            {
                await HandleApplicationExceptionAsync(context, ex);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleApplicationExceptionAsync(HttpContext context, PawnshopApplicationException exception)
        {
            await WriteExceptionAsync(context, HttpStatusCode.InternalServerError,
                exception.GetType().Name, exception.Messages).ConfigureAwait(false);
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            await WriteExceptionAsync(context, HttpStatusCode.InternalServerError,
                exception.GetType().Name, exception.Message).ConfigureAwait(false);
        }

        private async Task WriteExceptionAsync(HttpContext context, HttpStatusCode code, string type, params string[] messages)
        {
            var response = context.Response;
            response.ContentType = "application/json";
            response.StatusCode = (int) code;
            await response.WriteAsync(JsonConvert.SerializeObject(new
            {
                messages,
                type,
            })).ConfigureAwait(false);
        }
    }
}