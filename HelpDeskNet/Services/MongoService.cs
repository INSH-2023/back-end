using Microsoft.Extensions.Options;
using MongoDB.Driver;
using HelpDeskNet.Models;
using MongoDB.Bson;
using HelpDeskNet.Configures;
using HelpDeskNet.DTO;

namespace HelpDeskNet.Services
{
    public class MongoService
    {
        private readonly IMongoCollection<Requests> _HelpdesksCollection;

        public MongoService(IOptions<MongoDBConfigure> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _HelpdesksCollection = database.GetCollection<Requests>(mongoDBSettings.Value.CollectionName);
            Console.WriteLine("T");
        }

        public async Task<List<Requests>> GetAsync() {
            return await _HelpdesksCollection.Find(_ => true).ToListAsync();
        }
        public async Task CreateRequestAsync(Requests request) {
            await _HelpdesksCollection.InsertOneAsync(request);
            return;
        }
        public async Task<Requests> UpdateStatusAsync(string id, RequestStatusUpdated update) {
            FilterDefinition<Requests> filter = Builders<Requests>.Filter.Eq("Id", id);
            UpdateDefinition<Requests> updated = Builders<Requests>.Update.Set("request_status", update.RequestStatus);
            await _HelpdesksCollection.UpdateOneAsync(filter, updated);
            Requests newStatus = await _HelpdesksCollection.Find(request => request.Id == id).FirstAsync();
            return newStatus;
        }
        public async Task DeleteAsync(string id) {
            FilterDefinition<Requests> filter = Builders<Requests>.Filter.Eq("Id", id);
            await _HelpdesksCollection.DeleteOneAsync(filter);
            return;
        }
    }
}
