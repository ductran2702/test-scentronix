import { NO_SERVERS_ERROR } from "./errors";
import fetch from './utils/fetchWithTimeout'

export interface Server {
  url: string; // The URL of the server
  priority: number; // The priority of the server, lower numbers indicate higher priority
}

/**
 * Finds the online server with the lowest priority from a list of servers.
 *
 * This function sends a GET request to each server URL. If the server responds
 * with a status code in the range of 200-299 (indicating success), it is
 * considered online. The function will return the URL of the online server
 * with the lowest priority. If no servers are online or if requests time out,
 * an error is thrown.
 *
 * @param servers - An array of Server objects containing URLs and their associated priorities.
 * @param timeout - The timeout duration (in milliseconds) for each request. Defaults to 5000ms (5 seconds).
 * @returns A promise that resolves to the URL of the server with the lowest priority that is online.
 * @throws Error if no servers are online or if a timeout occurs.
 */
async function findServer(
  servers: Server[],
  timeout: number = 5000
): Promise<Server> {
  // Create an array of requests to each server URL with timeout handling
  const requests = servers.map((server) => {
    return fetch(server.url, { method: "GET" }, timeout).then((response: any) => {
      // Check if the response status is in the range of 200-299
      if (response.status >= 200 && response.status < 300) {
        return server; // Return the server if online
      }
      throw new Error("Server offline");
    });
  });

  const results = await Promise.allSettled(requests); // Wait for all requests to settle (either fulfilled or rejected)

  const onlineServers = results
    .filter(
      (result): result is PromiseFulfilledResult<Server> =>
        result.status === "fulfilled"
    ) // Type guard to filter only fulfilled results
    .map((result) => result.value); // Now TypeScript knows `result` has a `value` property

  if (onlineServers.length === 0) {
    throw new Error(NO_SERVERS_ERROR);
  }

  // Find the server with the lowest priority
  return onlineServers.reduce((prev, curr) =>
    prev.priority < curr.priority ? prev : curr
  );
}

export default findServer;
