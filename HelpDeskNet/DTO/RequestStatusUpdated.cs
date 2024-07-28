using HelpDeskNet.Models.Enum;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Serialization;

namespace HelpDeskNet.DTO
{
    public class RequestStatusUpdated
    {

        [BsonElement("request_status")]
        [JsonPropertyName("request_status")]
        public string RequestStatus { get; set; }
    }
}
