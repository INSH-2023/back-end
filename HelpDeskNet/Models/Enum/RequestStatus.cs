using System.Runtime.Serialization;

namespace HelpDeskNet.Models.Enum
{
    public enum RequestStatus
    {
        [EnumMember(Value = "REQUEST")]
        Request,
        [EnumMember(Value = "PENDING")]
        Pending,
        [EnumMember(Value = "PROGRESS")]
        Progress,
        [EnumMember(Value = "COMPLETE")]
        Complete,
        [EnumMember(Value = "CANCELED")]
        Canceled
    }
}
