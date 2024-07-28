using Amazon.Runtime.Internal;
using Azure.Core;
using HelpDeskNet.DTO;
using HelpDeskNet.Models;
using HelpDeskNet.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace HelpDeskNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly MongoService _mongoDBService;

        public RequestController(MongoService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet]
        public async Task<List<Requests>> Get() {
            return await _mongoDBService.GetAsync();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Requests request) {
            Console.WriteLine(request.RequestStatus.GetType());
            await _mongoDBService.CreateRequestAsync(request);
            return CreatedAtAction(nameof(Get), new { id = request.Id }, request);
        }

        [HttpPut("{id}")]
        public async Task<Requests> UpdateStatus(string id, [FromBody] RequestStatusUpdated status) {
            return await _mongoDBService.UpdateStatusAsync(id, status);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) {
            await _mongoDBService.DeleteAsync(id);
            return NoContent();
        }
    }
}
