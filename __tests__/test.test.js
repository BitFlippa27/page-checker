import { getWebsiteResponses } from '../services/servicesExport.js';

describe('getWebsiteResponses', () => {
  it('should return valid responses for valid URLs', async () => {
    const mockWebsites = [
      { url: 'https://example.com' },
      { url: 'https://another-example.com' },
    ];

    global.fetch = jest.fn((url) =>
      Promise.resolve({
        ok: true,
        clone: function() {
          return { url: url, loadingTime: 123, status: 200 };
        },
      })
    );

    const responses = await getWebsiteResponses(mockWebsites);

    expect(responses).toHaveLength(2);
    responses.forEach((response, i) => {
      expect(response.url).toBe(mockWebsites[i].url);
      expect(response.loadingTime).toBe(123);
      expect(response.status).toBe(200);
    });
  });

  it('should skip invalid URLs', async () => {
    const mockWebsites = [
      { url: 'https://example.com' },
      { url: 'invalid-url' },
    ];

    global.fetch = jest.fn((url) =>
      url === 'invalid-url'
        ? Promise.reject(new Error('Invalid URL'))
        : Promise.resolve({
            ok: true,
            clone: function() {
              return { url: url, loadingTime: 123, status: 200 };
            },
          })
    );

    const responses = await getWebsiteResponses(mockWebsites);

    expect(responses).toHaveLength(1);
    expect(responses[0].url).toBe('https://example.com');
  });
});