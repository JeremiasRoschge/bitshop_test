using System;

namespace server.Models

{


    public class PCWebhookData
    {
        public ExternalData External { get; set; }
        public InternalData Internal { get; set; }
    }

    public class ExternalData
    {
        public string Title { get; set; }
        public string ReferenceExternal { get; set; }
        public decimal Amount { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string CVU_CBUPayer { get; set; }
        public string TributaryIdentifierPayer { get; set; }
        public string NamePayer { get; set; }
        public string Channel { get; set; }
        public string OperationIdentifier { get; set; }
        public string ReferenceAux1 { get; set; }
        public string ReferenceAux2 { get; set; }
    }

    public class InternalData
    {
        public int StatusId { get; set; }
        public string Status { get; set; }
        public string Identifier { get; set; }
        public int TransactionReferece { get; set; }
        public string AccountNumber { get; set; }
    }

}