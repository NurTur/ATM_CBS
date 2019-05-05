using System;
using System.Text;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using FluentScheduler;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Pawnshop.Core.Options;
using Pawnshop.Web.Engine;
using Pawnshop.Web.Engine.Jobs;
using Pawnshop.Web.Engine.Middleware;
using Pawnshop.Web.Engine.Security;

namespace Pawnshop.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; set; }
        public IContainer ApplicationContainer { get; set; }

        private const string PawnshopApiServer = "Pawnshop API server";
        private readonly SecurityKey _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("m3gaSecretKe3y!devman.kz"));

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();

            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = PawnshopApiServer;
                options.Audience = PawnshopApiServer;
                options.SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
            });
            services.Configure<EnviromentAccessOptions>(options =>
            {
                options.DatabaseConnectionString = Configuration.GetConnectionString("database");
                options.StorageConnectionString = Configuration.GetConnectionString("storage");
                options.ExpireDay = 60;
                options.PaymentNotification = bool.Parse(Configuration.GetSection("AppSettings:paymentNotification").Value);

                options.NskEmailAddress = "aseln@nsk.kz";
                options.NskEmailName = "Асель Найзабекова";
                options.NskEmailCopyAddress = "arkhat@tascredit.kz";
                options.NskEmailCopyName = "Бекен Архат";
                options.InsuranseManagerAddress = "m.zhaniya@tascredit.kz";
                options.InsuranseManagerName = "Жания Малгаджарова";
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = PawnshopApiServer,

                        ValidateAudience = true,
                        ValidAudience = PawnshopApiServer,

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = _key,

                        RequireExpirationTime = true,
                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.Zero
                    };
                });

            ApplicationContainer = new AppContainer().Build(services);

            JobManager.JobFactory = new JobFactory(ApplicationContainer);
            JobManager.Initialize(new JobRegistry());

            return new AutofacServiceProvider(ApplicationContainer);
        }


        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();

            app.UseStaticFiles();
            app.UseExceptionHandling();
            app.UseSessionContext();
            app.UseBranchContext();
            app.UseMvc(router =>
            {
                router.MapRoute("api", "api/{controller}/{action}");
                router.MapRoute("default", "{*path}", new
                {
                    controller = "home",
                    action = "index"
                }, new
                {
                    httpMethod = new HttpMethodRouteConstraint("GET")
                });
            });


            appLifetime.ApplicationStopped.Register(() =>
            {
                ApplicationContainer?.Dispose();
                ApplicationContainer = null;
            });
        }
    }
}
