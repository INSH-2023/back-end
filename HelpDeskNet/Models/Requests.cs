using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Serialization;

namespace HelpDeskNet.Models
{
    public class Requests
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("request_id")]
        [JsonPropertyName("request_id")]
        public int RequestId { get; set; }

        [BsonElement("request_service_type")]
        [JsonPropertyName("request_service_type")]
        public string RequestServiceType { get; set; }

        [BsonElement("request_subject")]
        [JsonPropertyName("request_subject")]
        public string RequestSubject { get; set; }

        [BsonElement("request_status")]
        [JsonPropertyName("request_status")]
        public string RequestStatus { get; set; }

        [BsonElement("request_req_date")]
        [JsonPropertyName("request_req_date")]
        public DateTime RequestReqDate { get; set; }

        [BsonElement("request_assign")]
        [JsonPropertyName("request_assign")]
        public int RequestAssign { get; set; }

        [BsonElement("request_use_type")]
        [JsonPropertyName("request_use_type")]
        public string RequestUseType { get; set; }


        [BsonElement("request_other")]
        [JsonPropertyName("request_other")]
        public string? RequestOther { get; set; } = null!;

        [BsonElement("request_problem")]
        [JsonPropertyName("request_problem")]
        public string RequestProblem { get; set; }

        [BsonElement("request_message")]
        [JsonPropertyName("request_message")]
        public string? RequestMessage { get; set; } = null!;

        [BsonElement("request_sn")]
        [JsonPropertyName("request_sn")]
        public string? RequestSN { get; set; } = null!;

        [BsonElement("request_brand")]
        [JsonPropertyName("request_brand")]
        public string? RequestBrand { get; set; } = null!;

        [BsonElement("request_type_machine")]
        [JsonPropertyName("request_type_machine")]
        public string? RequestTypeMachine { get; set; } = null!;
    }
}
