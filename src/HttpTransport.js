import request from 'request';

/**
 * Fetching string data via URL
 */
export default class HttpTransport
{
  /**
   * Fetch the text contents of a URL
   */
  async get(url: String): Promise<String>
  {
    // Gotta manually wrap the promise with the weird callback signature
    return new Promise((resolve, reject) => {

      request.get(url, (err, resp, body) => {

        // Actual transport error
        if (err) {
          reject(err);
          return;
        }

        // Bad response will also throw
        if (resp.statusCode >= 400 && resp.statusCode < 500) {
          reject(new Error(`${resp.statusCode}: ${resp.statusMessage}`));
          return;
        }

        // Always just return string body
        resolve(body);

      });

    });
  }
}

