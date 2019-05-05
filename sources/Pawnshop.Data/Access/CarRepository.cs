using System;
using System.Collections.Generic;
using System.Linq;
using Pawnshop.Core;
using Pawnshop.Core.Impl;
using Pawnshop.Data.Models.Dictionaries;
using Dapper;
using Pawnshop.Core.Queries;
using Pawnshop.Data.Models.Contracts;

namespace Pawnshop.Data.Access
{
    public class CarRepository : RepositoryBase, IRepository<Car>
    {
        public CarRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public void Insert(Car entity)
        {
            using (var transaction = BeginTransaction())
            {
                entity.Id = UnitOfWork.Session.QuerySingleOrDefault<int>(@"
INSERT INTO Positions ( Name, CollateralType ) VALUES ( @Name, @CollateralType )
SELECT SCOPE_IDENTITY()",
                    new
                    {
                        Name = entity.TransportNumber,
                        CollateralType = CollateralType.Car,
                    }, UnitOfWork.Transaction);

                UnitOfWork.Session.Execute(@"
INSERT INTO Cars ( Id, Mark, Model, ReleaseYear, TransportNumber, MotorNumber, BodyNumber, TechPassportNumber, Color, TechPassportDate )
VALUES ( @Id, @Mark, @Model, @ReleaseYear, @TransportNumber, @MotorNumber, @BodyNumber, @TechPassportNumber, @Color, @TechPassportDate )",
                    entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Update(Car entity)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute(@"UPDATE Positions SET Name = @Name WHERE Id = @Id",
                    new
                    {
                        Id = entity.Id,
                        Name = entity.TransportNumber,
                    }, UnitOfWork.Transaction);

                UnitOfWork.Session.Execute(@"
UPDATE Cars SET Mark = @Mark, Model = @Model, ReleaseYear = @ReleaseYear, TransportNumber = @TransportNumber,
MotorNumber = @MotorNumber, BodyNumber = @BodyNumber, TechPassportNumber = @TechPassportNumber, Color = @Color,
TechPassportDate = @TechPassportDate
WHERE Id = @Id",
                    entity, UnitOfWork.Transaction);

                transaction.Commit();
            }
        }

        public void Delete(int id)
        {
            using (var transaction = BeginTransaction())
            {
                UnitOfWork.Session.Execute("DELETE FROM Cars WHERE Id = @id", new { id = id }, UnitOfWork.Transaction);
                UnitOfWork.Session.Execute("DELETE FROM Positions WHERE Id = @id", new { id = id }, UnitOfWork.Transaction);
                transaction.Commit();
            }
        }

        public Car Get(int id)
        {
            return UnitOfWork.Session.QuerySingleOrDefault<Car>(@"
SELECT *
FROM Cars
JOIN Positions ON Positions.Id = Cars.Id
WHERE Cars.Id = @id", new { id });
        }

        public Car Find(object query)
        {
            throw new NotImplementedException();
        }

        public List<Car> List(ListQuery listQuery, object query = null)
        {
            if (listQuery == null) throw new ArgumentNullException(nameof(listQuery));

            var condition = listQuery.Like(string.Empty, "Name", "Mark", "Model");
            var order = listQuery.Order(string.Empty, new Sort
            {
                Name = "Name",
                Direction = SortDirection.Asc
            });
            var page = listQuery.Page();

            return UnitOfWork.Session.Query<Car>($@"
SELECT *
FROM Cars
JOIN Positions ON Positions.Id = Cars.Id
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

            var condition = listQuery.Like(string.Empty, "Name", "Mark", "Model");

            return UnitOfWork.Session.ExecuteScalar<int>($@"
SELECT COUNT(*)
FROM Cars
JOIN Positions ON Positions.Id = Cars.Id
{condition}", new
            {
                listQuery.Filter
            });
        }

        public int RelationCount(int positionId)
        {
            return UnitOfWork.Session.ExecuteScalar<int>(@"
SELECT COUNT(*)
FROM ContractPositions
WHERE PositionId = @positionId", new { positionId = positionId });
        }

        public List<string> Marks()
        {
            return UnitOfWork.Session.Query<string>(@"
SELECT Mark
FROM Cars
GROUP BY Mark").ToList();
        }

        public List<string> Models()
        {
            return UnitOfWork.Session.Query<string>(@"
SELECT Model
FROM Cars
GROUP BY Model").ToList();
        }

        public List<string> Colors()
        {
            return UnitOfWork.Session.Query<string>(@"
SELECT Color
FROM Cars
GROUP BY Color").ToList();
        }
    }
}