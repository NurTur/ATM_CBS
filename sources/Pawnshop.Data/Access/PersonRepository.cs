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
    public class PersonRepository : RepositoryBase, IRepository<Person>
    {
        public PersonRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Person entity)
        {
            using (var transaction = BeginTransaction())
            {
                var query = @"
INSERT INTO Clients 
( CardType, CardNumber, IdentityNumber, Fullname, Address, MobilePhone, StaticPhone, Email, 
  DocumentType, DocumentNumber, DocumentSeries, DocumentDate, DocumentDateExpire, DocumentProvider, Note,RegistrationAddress, BirthPlace)
VALUES ( @CardType, @CardNumber, @IdentityNumber, @Fullname, @Address, @MobilePhone, @StaticPhone, @Email, 
  @DocumentType, @DocumentNumber, @DocumentSeries, @DocumentDate, @DocumentDateExpire, @DocumentProvider, @Note, @RegistrationAddress, @BirthPlace)
SELECT SCOPE_IDENTITY()";

                entity.Id = UnitOfWork.Session.ExecuteScalar<int>(query, entity, UnitOfWork.Transaction);
                
                UnitOfWork.Session.Execute("INSERT INTO Persons ( Id ) VALUES ( @Id )", new { Id = entity.Id }, UnitOfWork.Transaction);

                transaction.Commit();
            }

        }

        public void Update(Person entity)
        {
            using (var transaction = BeginTransaction())
            {
                var query = @"
UPDATE Clients
SET CardType = @CardType, CardNumber = @CardNumber, IdentityNumber = @IdentityNumber, Fullname = @Fullname, Address = @Address, 
    MobilePhone = @MobilePhone, StaticPhone = @StaticPhone, Email = @Email, DocumentType = @DocumentType, DocumentNumber = @DocumentNumber, 
    DocumentSeries = @DocumentSeries, DocumentDate = @DocumentDate, DocumentProvider = @DocumentProvider, Note = @Note,
    BirthPlace = @BirthPlace, RegistrationAddress = @RegistrationAddress, DocumentDateExpire = @DocumentDateExpire
WHERE Id = @Id";

                UnitOfWork.Session.Execute(query, entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE Clients SET DeleteDate = dbo.GETASTANADATE() WHERE Id = @id", new { id = id }, UnitOfWork.Transaction);
                
                transaction.Commit();
            }

        }

        public Person Get(int id)
        {
            var entity = UnitOfWork.Session.QuerySingleOrDefault<Person>(@"
SELECT *
  FROM Persons
  JOIN Clients ON Clients.Id = Persons.Id
WHERE Persons.Id = @id", new { id = id });

            entity.Files = UnitOfWork.Session.Query<FileRow>(@"
SELECT FileRows.*
  FROM ClientFileRows
  JOIN FileRows ON ClientFileRows.FileRowId = FileRows.Id
 WHERE ClientFileRows.ClientId = @id", new { id }).ToList();

            return entity;
        }

        public Person Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Person> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like("Clients.DeleteDate IS NULL", "Fullname", "IdentityNumber", "DocumentNumber", "ContractNumber", "MobilePhone");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Fullname",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Person>($@"
SELECT DISTINCT Persons.*, Clients.*
FROM Persons
JOIN Clients ON Clients.Id = Persons.Id
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

            var condition = listQuery.Like("Clients.DeleteDate IS NULL", "Fullname", "IdentityNumber", "DocumentNumber", "ContractNumber", "MobilePhone");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(DISTINCT Persons.Id)
FROM Persons
JOIN Clients ON Clients.Id = Persons.Id
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