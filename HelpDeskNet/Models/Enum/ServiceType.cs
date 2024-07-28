using System.Runtime.Serialization;

namespace HelpDeskNet.Models.Enum
{
    public enum ServiceType
    {
        [EnumMember(Value = "IT")]
        IT,
        [EnumMember(Value = "MEDIA")]
        Media
    }
}
