import { jest } from "@jest/globals";
import findServer, { Server } from "./findServer";
import fetchMock from "jest-fetch-mock";
import { NO_SERVERS_ERROR } from "./errors";

describe("findServer", () => {
  const servers: Server[] = [
    {
      url: "https://does-not-work.perfume.new",
      priority: 1,
    },
    {
      url: "https://gitlab.com",
      priority: 4,
    },
    {
      url: "http://app.scnt.me",
      priority: 3,
    },
    {
      url: "https://offline.scentronix.com",
      priority: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("should return the online server with the lowest priority", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 200 })) // Server 1 (online)
      .mockResolvedValueOnce(new Response(null, { status: 200 })) // Server 2 (online)
      .mockResolvedValueOnce(new Response(null, { status: 503 })) // Server 3 (offline)
      .mockResolvedValueOnce(new Response(null, { status: 503 })); // Server 4 (offline)

    const result = await findServer(servers);
    expect(result).toEqual(servers[0]);
  });

  it("should return the online server with the lowest priority", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 503 })) // Server 1 (offline)
      .mockResolvedValueOnce(new Response(null, { status: 200 })) // Server 2 (online)
      .mockResolvedValueOnce(new Response(null, { status: 503 })) // Server 3 (offline)
      .mockResolvedValueOnce(new Response(null, { status: 503 })); // Server 4 (offline)

    const result = await findServer(servers);
    expect(result).toEqual(servers[1]);
  });

  it("should throw an error if no servers are online", async () => {
    fetchMock
      .mockResolvedValue(new Response(null, { status: 503 }));

    await expect(findServer(servers)).rejects.toThrow(NO_SERVERS_ERROR);
  });

  it("should throw a timeout error if request takes longer than 5 seconds", async () => {
    jest.useFakeTimers();

    fetchMock
      .mockResolvedValue(new Response(null, { status: 200 }))
    const promise = findServer(servers);

    jest.advanceTimersByTime(5000);
    await expect(promise).rejects.toThrow(NO_SERVERS_ERROR);

    jest.useRealTimers();
  });
});
