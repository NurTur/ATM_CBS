using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Pawnshop.Core;
using Pawnshop.Data.Access;
using Pawnshop.Data.Models.Contracts;
using Pawnshop.Data.Models.Dictionaries;
using Pawnshop.Data.Models.Membership;
using Pawnshop.Web.Engine.Storage;
using Pawnshop.Web.Models.Membership;

namespace Pawnshop.Web.Engine.Export
{
    public class AnnuityContractWordBuilder
    {
        private readonly IStorage _storage;
        private readonly BranchContext _branchContext;
        private readonly ISessionContext _sessionContext;
        private readonly UserRepository _userRepository;
        private readonly LoanPercentRepository _loanPercentRepository;

        public AnnuityContractWordBuilder(IStorage storage, BranchContext branchContext, ISessionContext sessionContext, UserRepository userRepository, LoanPercentRepository loanPercentRepository)
        {
            _storage = storage;
            _branchContext = branchContext;
            _sessionContext = sessionContext;
            _userRepository = userRepository;
            _loanPercentRepository = loanPercentRepository;
        }

        public async Task<Stream> Build(Contract model)
        {
            var template = Template();
            var stream = await _storage.Load(template, ContainerName.AnnuityTemplates);
            var user = _userRepository.Get(_sessionContext.UserId);
            var profile = _loanPercentRepository.Find(new LoanPercentQueryModel
            {
                BranchId = _branchContext.Branch.Id,
                CollateralType = model.CollateralType,
                CardType = model.ContractData.Client.CardType,
                LoanCost = model.LoanCost,
                LoanPeriod = model.LoanPeriod
            });

            var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using (var document = WordprocessingDocument.Open(memoryStream, true))
            {
                var paragraphs = document.MainDocumentPart.Document.Body.Descendants<Paragraph>();
                foreach (var paragraph in paragraphs)
                {
                    var text = SearchParts(paragraph.InnerText, model, user, profile);
                    if (!paragraph.InnerText.Equals(text))
                    {
                        var properties = paragraph.Descendants<RunProperties>().FirstOrDefault();

                        paragraph.RemoveAllChildren<Run>();
                        var run = paragraph.AppendChild(new Run());
                        if (properties != null)
                        {
                            run.RunProperties = (RunProperties)properties.Clone();
                        }
                        run.AppendChild(new Text(text));
                    }
                }

                return memoryStream;
            }
        }

        private string Template()
        {
            switch (_branchContext.Branch.Name)
            {
                case "AKU":
                    return "annuity-contract-aktau.docx";
                case "AKT":
                    return "annuity-contract-aktobe.docx";
                case "AST":
                    return "annuity-contract-astana.docx";
                case "ATY":
                    return "annuity-contract-atyrau.docx";
                case "ABA":
                    return "annuity-contract-almaty.docx";
                case "BZK":
                    return "annuity-contract-bzk.docx";
                case "KRG":
                    return "annuity-contract-karaganda.docx";
                case "KSK":
                    return "annuity-contract-kaskelen.docx";
                case "KKS":
                    return "annuity-contract-kokshetau.docx";
                case "KZO":
                    return "annuity-contract-kyzylorda.docx";
                case "OSK":
                    return "annuity-contract-oskemen.docx";
                case "PAV":
                    return "annuity-contract-pavlodar.docx";
                case "SEM":
                    return "annuity-contract-semey.docx";
                case "TAL":
                    return "annuity-contract-taldyk.docx";
                case "TRZ":
                    return "annuity-contract-taraz.docx";
                case "TKS":
                    return "annuity-contract-turkestan.docx";
                case "SHM":
                    return "annuity-contract-shymkent.docx";
                case "SAR":
                    return "annuity-contract-saryagash.docx";
                case "ALA":
                    return "annuity-contract-ala.docx";
                case "SRM":
                    return "annuity-contract-sayram.docx";
                case "ZHK":
                    return "annuity-contract-zhk.docx";
                case "URL":
                    return "annuity-contract-uralsk.docx";
                case "NUR":
                    return "annuity-contract-nursultan.docx";
                default:
                    return "annuity-contract.docx";
            }
        }

        private string SearchParts(string text, Contract model, User user, LoanPercentSetting profile)
        {
            text = ReplacePart(text, "###номер билета&", model.ContractNumber);
            text = ReplacePart(text, "###дата билета&", model.ContractDate.ToString("dd.MM.yyyy"));
            text = ReplacePart(text, "###клиент&", model.ContractData.Client.Fullname);
            text = ReplacePart(text, "###РНН клиента&", model.ContractData.Client.IdentityNumber);
            text = ReplacePart(text, "###номер уд&", model.ContractData.Client.DocumentNumber);
            text = ReplacePart(text, "###выдано&", model.ContractData.Client.DocumentDate.ToString("dd.MM.yyyy"));
            text = ReplacePart(text, "###кем&", model.ContractData.Client.DocumentProvider);
            text = ReplacePart(text, "###адресс клиента&", model.ContractData.Client.Address);
            text = ReplacePart(text, "###название ломбарда&", _branchContext.Configuration.LegalSettings.LegalName);
            text = ReplacePart(text, "###оценка&", model.EstimatedCost.ToString());
            text = ReplacePart(text, "###сумма оценки&", model.EstimatedCost.ToWords());
            text = ReplacePart(text, "###ссуда&", model.LoanCost.ToString());
            text = ReplacePart(text, "###сумма ссуды&", model.LoanCost.ToWords());
            text = ReplacePart(text, "###дата возврата&", model.OriginalMaturityDate.ToString("dd.MM.yyyy"));
            text = ReplacePart(text, "###процент&", model.LoanPercent.ToString("n4"));
            text = ReplacePart(text, "###телефон ломбарда&", _branchContext.Configuration.ContactSettings.Phone);
            text = ReplacePart(text, "###срок займа&", model.MaturityDate.MonthDifference(model.ContractDate).ToString());
            text = ReplacePart(text, "###процент год&", decimal.ToInt32(Math.Round(model.LoanPercent * 30 * 12)).ToString());
            text = ReplacePart(text, "###процент месяц&", Math.Round(model.LoanPercent * 30, 1).ToString("N1"));
            text = ReplacePart(text, "###процент штраф&", model.PenaltyPercent.ToString("N4"));
            if (model.CollateralType == CollateralType.Car)
            {
                var position = model.Positions.FirstOrDefault();
                if (position != null)
                {
                    var car = (Car)position.Position;
                    text = ReplacePart(text, "###марка&", car.Mark);
                    text = ReplacePart(text, "###модель&", car.Model);
                    text = ReplacePart(text, "###номер&", car.TransportNumber);
                    text = ReplacePart(text, "###год выпуска&", car.ReleaseYear.ToString());
                    text = ReplacePart(text, "###двигатель&", car.MotorNumber);
                    text = ReplacePart(text, "###кузов&", car.BodyNumber);
                    text = ReplacePart(text, "###цвет&", car.Color);
                    text = ReplacePart(text, "###номер тс&", car.TechPassportNumber);
                    text = ReplacePart(text, "###дата тс&", (car.TechPassportDate.HasValue ? car.TechPassportDate.Value.ToString("dd.MM.yyyy") : string.Empty));
                }
            }
            else if (model.CollateralType == CollateralType.Machinery)
            {
                var position = model.Positions.FirstOrDefault();
                if (position != null)
                {
                    var machinery = (Machinery)position.Position;
                    text = ReplacePart(text, "###марка&", machinery.Mark);
                    text = ReplacePart(text, "###модель&", machinery.Model);
                    text = ReplacePart(text, "###номер&", machinery.TransportNumber);
                    text = ReplacePart(text, "###год выпуска&", machinery.ReleaseYear.ToString());
                    text = ReplacePart(text, "###двигатель&", machinery.MotorNumber);
                    text = ReplacePart(text, "###кузов&", machinery.BodyNumber);
                    text = ReplacePart(text, "###цвет&", machinery.Color);
                    text = ReplacePart(text, "###номер тс&", machinery.TechPassportNumber);
                    text = ReplacePart(text, "###дата тс&", (machinery.TechPassportDate.HasValue ? machinery.TechPassportDate.Value.ToString("dd.MM.yyyy") : string.Empty));
                }
            }
            text = ReplacePart(text, "###адресс ломбарда&", _branchContext.Configuration.ContactSettings.Address);
            text = ReplacePart(text, "###эксперт&", user.Fullname);
            text = ReplacePart(text, "###мораторий&", ((profile?.MinLoanPeriod ?? 90) / 30).ToString());
            return text;
        }

        private string ReplacePart(string text, string part, string replace)
        {
            var regex = new Regex(part);
            return regex.Replace(text, replace ?? string.Empty);
        }
    }
}
