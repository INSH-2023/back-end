using HelpDeskNet.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using HelpDeskNet.Configures;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/* builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"))
        .EnableTokenAcquisitionToCallDownstreamApi()
            .AddDownstreamApi("DownstreamApi", builder.Configuration.GetSection("DownstreamApi"))
            .AddInMemoryTokenCaches();
*/

builder.Services.AddControllers();

builder.Services.Configure<MongoDBConfigure>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<MongoService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// app.UseAuthentication();

// app.UseAuthorization();

app.MapControllers();

app.Run();
