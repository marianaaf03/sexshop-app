using SexShop.Application.Common;

namespace SexShop.Web.Services;

public interface IApiClient
{
    Task<ApiResponse<T>> GetAsync<T>(string url, string? token = null);
    Task<ApiResponse<T>> PostAsync<T>(string url, object data, string? token = null);
    Task<ApiResponse<T>> PutAsync<T>(string url, object data, string? token = null);
    Task<ApiResponse<T>> DeleteAsync<T>(string url, string? token = null);
}

public class ApiClient : IApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ApiClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _httpClient.BaseAddress = new Uri(_configuration["ApiUrl"] ?? "http://localhost:5000/");
    }

    public async Task<ApiResponse<T>> GetAsync<T>(string url, string? token = null)
    {
        AddToken(token);
        var response = await _httpClient.GetAsync(url);
        return await ProcessResponse<T>(response);
    }

    public async Task<ApiResponse<T>> PostAsync<T>(string url, object data, string? token = null)
    {
        AddToken(token);
        var response = await _httpClient.PostAsJsonAsync(url, data);
        return await ProcessResponse<T>(response);
    }

    public async Task<ApiResponse<T>> PutAsync<T>(string url, object data, string? token = null)
    {
        AddToken(token);
        var response = await _httpClient.PutAsJsonAsync(url, data);
        return await ProcessResponse<T>(response);
    }

    public async Task<ApiResponse<T>> DeleteAsync<T>(string url, string? token = null)
    {
        AddToken(token);
        var response = await _httpClient.DeleteAsync(url);
        return await ProcessResponse<T>(response);
    }

    private void AddToken(string? token)
    {
        if (!string.IsNullOrEmpty(token))
        {
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }
    }

    private async Task<ApiResponse<T>> ProcessResponse<T>(HttpResponseMessage response)
    {
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<ApiResponse<T>>();
            return result ?? ApiResponse<T>.FailureResponse("Empty response from API");
        }
        
        var error = await response.Content.ReadFromJsonAsync<ApiResponse<T>>();
        return error ?? ApiResponse<T>.FailureResponse($"API Error: {response.StatusCode}");
    }
}
