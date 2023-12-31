using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace server.Models
{

    public class QR
    {
        public int Amount { get; set; }
        public long TributaryIdentifier { get; set; }
        public string Cvu { get; set; }
        public string ReferenceExternal { get; set; }
        public string ExpirationMinute{ get; set; }
        public string System { get; set; }
        public string Title { get; set; }

        public QR() { }

        public QR(int amount, long tributaryIdentifier, string cvu, string referenceExternal, string expirationMinute, string system, string title)
        {
            Amount = amount;
            TributaryIdentifier = tributaryIdentifier;
            Cvu = cvu;
            ReferenceExternal = referenceExternal;
            ExpirationMinute = expirationMinute;
            System = system;
            Title = title;
        }
    }
}