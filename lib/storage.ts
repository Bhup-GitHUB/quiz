// Storage module using Upstash Redis
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), ".local-data.json");

interface LocalData {
  responses: Record<string, object>;
}

// Initialize Redis client - will use environment variables automatically
// Supports: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// OR: KV_REST_API_URL + KV_REST_API_TOKEN
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) return redis;
  
  try {
    redis = Redis.fromEnv();
    return redis;
  } catch (error) {
    console.log("Redis not configured, will use file-based storage for local development");
    return null;
  }
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
  const client = getRedisClient();
  
  if (client) {
    try {
      // Store the response with a key
      await client.set(`response:${id}`, response);
      // Add the ID to a set of all response IDs
      await client.sadd("response_ids", id);
      console.log(`Saved response ${id} to Redis`);
      return;
    } catch (error) {
      console.error("Error saving to Redis:", error);
      // Fall through to file-based storage
    }
  }
  
  // Fallback to file-based storage for local development
  console.log(`Saving response ${id} to local file`);
  const data = readLocalData();
  data.responses[id] = response;
  writeLocalData(data);
}

export async function getResponse(id: string) {
  const client = getRedisClient();
  
  if (client) {
    try {
      const response = await client.get(`response:${id}`);
      console.log(`Retrieved response ${id} from Redis:`, response ? "found" : "not found");
      return response;
    } catch (error) {
      console.error("Error getting from Redis:", error);
      // Fall through to file-based storage
    }
  }
  
  // Fallback to file-based storage for local development
  console.log(`Retrieving response ${id} from local file`);
  const data = readLocalData();
  return data.responses[id] || null;
}

export async function getAllResponses() {
  const client = getRedisClient();
  
  if (client) {
    try {
      // Get all response IDs from the set
      const responseIds = await client.smembers<string[]>("response_ids");
      console.log(`Retrieved ${responseIds?.length || 0} response IDs from Redis`);

      if (!responseIds || responseIds.length === 0) {
        return [];
      }

      // Fetch all responses in parallel
      const responses = await Promise.all(
        responseIds.map(async (id) => {
          const response = await client.get(`response:${id}`);
          return response;
        })
      );

      // Filter out null responses and sort by submission date
      return responses
        .filter((r) => r !== null)
        .sort((a: any, b: any) => {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        });
    } catch (error) {
      console.error("Error getting all responses from Redis:", error);
      // Fall through to file-based storage
    }
  }
  
  // Fallback to file-based storage for local development
  console.log("Retrieving all responses from local file");
  const data = readLocalData();
  const responses = Object.values(data.responses);
  return responses.sort((a: any, b: any) => {
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });
}
