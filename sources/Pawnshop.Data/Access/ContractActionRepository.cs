using System.Collections.Generic;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts.Actions;

namespace Pawnshop.Data.Access
{
    public class ContractActionRepository : RepositoryBase, IRepository<ContractAction>
    {
        public ContractActionRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(ContractAction entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.ExecuteScalar<int>($@"
INSERT INTO ContractActions
       ( ContractId, ActionType, Date, TotalCost, Note, Reason, Data, FollowedId, AuthorId, CreateDate )
VALUES ( @ContractId, @ActionType, @Date, @TotalCost, @Note, @Reason, @Data, @FollowedId, @AuthorId, @CreateDate )
SELECT SCOPE_IDENTITY()", entity, UnitOfWork.Transaction);

                if (entity.Rows != null)
                {
                    foreach (var row in entity.Rows)
                        row.ActionId = entity.Id;

                    UnitOfWork.Session.Execute(@"
INSERT INTO ContractActionRows
       ( ActionId, PaymentType, Period, OriginalPercent, ""Percent"", Cost, DebitAccountId, CreditAccountId, OrderId )
VALUES ( @ActionId, @PaymentType, @Period, @OriginalPercent, @Percent, @Cost, @DebitAccountId, @CreditAccountId, @OrderId )", entity.Rows, UnitOfWork.Transaction);
                }

                transaction.Commit();
            }
        }

        public void Update(ContractAction entity)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(int id)
        {
            UnitOfWork.Session.Execute(@"UPDATE ContractActions SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id", new { id }, UnitOfWork.Transaction);
        }

        public ContractAction Get(int id)
        {
            throw new System.NotImplementedException();
        }

        public ContractAction Find(object query)
        {
            throw new System.NotImplementedException();
        }

        public List<ContractAction> List(ListQuery listQuery, object query = null)
        {
            throw new System.NotImplementedException();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            throw new System.NotImplementedException();
        }
    }
}