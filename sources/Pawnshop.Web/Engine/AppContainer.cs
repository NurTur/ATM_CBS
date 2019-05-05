using System;
using System.Collections.Generic;
using Autofac;
using Autofac.Core;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Pawnshop.Core;
using Pawnshop.Core.Options;
using Pawnshop.Data;
using Pawnshop.Web.Engine.Audit;
using Pawnshop.Web.Engine.Export;
using Pawnshop.Web.Engine.Export.Reports;
using Pawnshop.Web.Engine.Jobs;
using Pawnshop.Web.Engine.MessageSenders;
using Pawnshop.Web.Engine.Security;
using Pawnshop.Web.Engine.Storage;

namespace Pawnshop.Web.Engine
{
    public class AppContainer
    {
        private readonly IList<Type> _viewModules = new List<Type>();

        public IContainer Build(IServiceCollection services)
        {
            var builder = new ContainerBuilder();

            RegisterMvc(services);
            RegisterPermissions(services);
            builder.Populate(services);

            builder.RegisterModule<CoreModule>();
            builder.RegisterModule<DataModule>();

            builder.RegisterType<TokenProvider>().AsSelf();
            builder.RegisterType<SaltedHash>().AsSelf();

            builder.RegisterType<AzureStorage>().As<IStorage>();
            builder.Register(context =>
            {
                var options = context.Resolve<IOptions<EnviromentAccessOptions>>().Value;
                var account = CloudStorageAccount.Parse(options.StorageConnectionString);

                return account.CreateCloudBlobClient();
            }).As<CloudBlobClient>().InstancePerLifetimeScope();

            builder.RegisterType<BranchContext>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<EventLog>().AsSelf().InstancePerLifetimeScope();

            builder.RegisterType<CashOrdersExcelBuilder>().AsSelf();
            builder.RegisterType<ContractsExcelBuilder>().AsSelf();
            builder.RegisterType<SellingsExcelBuilder>().AsSelf();
            builder.RegisterType<EventLogExcelBuilder>().AsSelf();
            builder.RegisterType<ContractMonitoringExcelBuilder>().AsSelf();
            builder.RegisterType<AccountAnalysisExcelBuilder>().AsSelf();

            builder.RegisterType<ContractWordBuilder>().AsSelf();
            builder.RegisterType<AnnuityContractWordBuilder>().AsSelf();

            builder.RegisterType<EmailSender>().AsSelf();
            builder.RegisterType<SmsSender>().AsSelf();

            builder.RegisterType<MessageSenderJob>().AsSelf();
            builder.RegisterType<PaymentNotificationJob>().AsSelf();

            builder.RegisterType<InsuranceEmailSender>().AsSelf();

            return builder.Build();
        }

        private void RegisterPermissions(IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                var permissions = Permissions.All;
                foreach (var permission in permissions)
                {
                    var permissionName = permission.Name;
                    options.AddPolicy(permissionName, p => p.RequireClaim(TokenProvider.PermissionClaim, permissionName));
                }
            });
        }

        private void RegisterMvc(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        private void RegisterModule<T>(ContainerBuilder builder, bool withViews = true) where T : IModule, new()
        {
            builder.RegisterModule<T>();
            if (withViews)
            {
                _viewModules.Add(typeof(T));
            }
        }
    }
}