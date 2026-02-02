// Shared storage module that works locally and on Vercel

// In-memory storage for local development
const localResponses = new Map<string, object>();
const localResponseIds = new Set<string>();

export async function saveResponse(id: string, response: object) {
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(`response:${id}`, response);
    await kv.sadd("response_ids", id);
  } catch {
    // Vercel KV not available, use local storage
    localResponses.set(id, response);
    localResponseIds.add(id);
  }
}

export async function getResponse(id: string) {
  try {
    const { kv } = await import("@vercel/kv");
    return await kv.get(`response:${id}`);
  } catch {
    // Vercel KV not available, use local storage
    return localResponses.get(id) || null;
  }
}

export async function getAllResponses() {
  try {
    const { kv } = await import("@vercel/kv");
    const responseIds = await kv.smembers("response_ids");

    if (!responseIds || responseIds.length === 0) {
      return [];
    }

    const responses = await Promise.all(
      responseIds.map(async (id) => {
        const response = await kv.get(`response:${id}`);
        return response;
      })
    );

    return responses
      .filter((r) => r !== null)
      .sort((a: any, b: any) => {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  } catch {
    // Vercel KV not available, use local storage
    const responses = Array.from(localResponses.values());
    return responses.sort((a: any, b: any) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }
}
