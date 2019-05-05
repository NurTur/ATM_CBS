using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Clients;
using Pawnshop.Data.Models.Files;

namespace Pawnshop.Data.Access
{
    public class CompanyRepository : RepositoryBase, IRepository<Company>
    {
        public CompanyRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Company entity)
        {
            using (var transaction = BeginTransaction())
            {
                var query = @"
INSERT INTO Clients 
( CardType, CardNumber, IdentityNumber, Fullname, Address, MobilePhone, StaticPhone, Email, 
  DocumentType, DocumentNumber, DocumentSeries, DocumentDate, DocumentProvider, Note )
VALUES ( @CardType, @CardNumber, @IdentityNumber, @Fullname, @Address, @MobilePhone, @StaticPhone, @Email, 
  @DocumentType, @DocumentNumber, @DocumentSeries, @DocumentDate, @DocumentProvider, @Note )
SELECT SCOPE_IDENTITY()";

                var clientId = UnitOfWork.Session.ExecuteScalar<int>(query, entity, UnitOfWork.Transaction);

                UnitOfWork.Session.Execute(@"
INSERT INTO Companies
( Id, Kbe, BankId )
VALUES ( @Id, @Kbe, @BankId )",
                new
                {
                    Id = clientId,
                    Kbe = entity.Kbe,
                    BankId = entity.BankId,
                }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Company entity)
        {
            using (var transaction = BeginTransaction())
            {
                var query = @"
UPDATE Clients
SET CardType = @CardType, CardNumber = @CardNumber, IdentityNumber = @IdentityNumber, Fullname = @Fullname, Address = @Address, 
    MobilePhone = @MobilePhone, StaticPhone = @StaticPhone, Email = @Email, DocumentType = @DocumentType, DocumentNumber = @DocumentNumber, 
    DocumentSeries = @DocumentSeries, DocumentDate = @DocumentDate, DocumentProvider = @DocumentProvider, Note = @Note 
WHERE Id = @Id";

                UnitOfWork.Session.Execute(query, entity, UnitOfWork.Transaction);

                UnitOfWork.Session.Execute(@"
UPDATE Companies
SET Kbe = @Kbe, BankId = @BankId 
WHERE Id = @Id",
                new
                {
                    Id = entity.Id,
                    Kbe = entity.Kbe,
                    BankId = entity.BankId,
                }, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE Clients SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id", new { id = id }, UnitOfWork.Transaction);
            }
        }

        public Company Get(int id)
        {
            var entity = UnitOfWork.Session.QuerySingleOrDefault<Company>(@"
SELECT *
  FROM Companies
  JOIN Clients ON Clients.Id = Companies.Id
WHERE Companies.Id = @id", new { id });

            entity.Files = UnitOfWork.Session.Query<FileRow>(@"
SELECT FileRows.*
  FROM ClientFileRows
  JOIN FileRows ON ClientFileRows.FileRowId = FileRows.Id
 WHERE ClientFileRows.ClientId = @id", new { id }).ToList();

            return entity;
        }

        public Company Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Company> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like("Clients.DeleteDate IS NULL", "Fullname", "IdentityNumber", "DocumentNumber", "ContractNumber");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Fullname",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Company>($@"
SELECT DISTINCT Companies.*, Clients.*
FROM Companies
JOIN Clients ON Clients.Id = Companies.Id
LEFT JOIN Contracts ON Clients.Id = Contracts.ClientId
{condition} {order} {page}", new
            {
                listQuery.Page?.Offset,
                listQuery.Page?.Limit,
                listQuery.Filter
            }).ToList();
        }

        public int Count(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like("Clients.DeleteDate IS NULL", "Fullname", "IdentityNumber", "DocumentNumber", "ContractNumber");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(DISTINCT Companies.Id)
FROM Companies
JOIN Clients ON Clients.Id = Companies.Id
LEFT JOIN Contracts ON Clients.Id = Contracts.ClientId
{condition}", new
            {
                listQuery.Filter
            });
        }

        public int RelationCount(int clientId)
        {
            return UnitOfWork.Session.ExecuteScalar<int>(@"
SELECT COUNT(*)
FROM Contracts
WHERE ClientId = @clientId", new { clientId });
        }
    }
}