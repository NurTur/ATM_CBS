using System.Collections.Generic;
using Newtonsoft.Json;
using Pawnshop.Data.Models.Files;

namespace Pawnshop.Data.Models.Clients
{
    /// <summary>
    /// Человек (клиент)
    /// </summary>
    public class Person : Client
    {
        public Person()
        {
        }

        public Person(Client client)
        {
            this.Id = client.Id;
            this.CardType = client.CardType;
            this.CardNumber = client.CardNumber;
            this.IdentityNumber = client.IdentityNumber;
            this.Fullname = client.Fullname;
            this.Address = client.Address;
            this.MobilePhone = client.MobilePhone;
            this.StaticPhone = client.StaticPhone;
            this.DocumentType = client.DocumentType;
            this.DocumentNumber = client.DocumentNumber;
            this.DocumentSeries = client.DocumentSeries;
            this.DocumentDate = client.DocumentDate;
            this.DocumentDateExpire = client.DocumentDateExpire;
            this.DocumentProvider = client.DocumentProvider;
            this.Note = client.Note;
            this.RegistrationAddress = client.RegistrationAddress;
            this.BirthPlace = client.BirthPlace;
        }
    }
}