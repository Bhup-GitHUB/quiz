// Shared storage module that works locally and on Vercel
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), ".local-data.json");

interface LocalData {
  responses: Record<string, object>;
}

function readLocalData(): LocalData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Error reading local data:", e);
  }
  return { responses: {} };
}

function writeLocalData(data: LocalData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error writing local data:", e);
  }
}

export async function saveResponse(id: string, response: object) {
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(`response:${id}`, response);
    await kv.sadd("response_ids", id);
  } catch {
    // Vercel KV not available, use file-based storage
    const data = readLocalData();
    data.responses[id] = response;
    writeLocalData(data);
  }
}

export async function getResponse(id: string) {
  try {
    const { kv } = await import("@vercel/kv");
    return await kv.get(`response:${id}`);
  } catch {
    // Vercel KV not available, use file-based storage
    const data = readLocalData();
    return data.responses[id] || null;
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
    // Vercel KV not available, use file-based storage
    const data = readLocalData();
    const responses = Object.values(data.responses);
    return responses.sort((a: any, b: any) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }
}
