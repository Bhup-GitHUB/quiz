import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), ".local-data.json");

function getRedisClient(): Redis | null {
  try {
    return Redis.fromEnv();
  } catch (error) {
    return null;
  }
}

export async function DELETE() {
  try {
    const redis = getRedisClient();
    
    if (redis) {
      // Clear Upstash Redis
      try {
        const responseIds = await redis.smembers<string[]>("response_ids");

        if (responseIds && responseIds.length > 0) {
          // Delete all response entries
          await Promise.all(
            responseIds.map(async (id) => {
              await redis.del(`response:${id}`);
            })
          );
          // Clear the response IDs set
          await redis.del("response_ids");
        }

        return NextResponse.json({
          success: true,
          message: `Cleared ${responseIds?.length || 0} submissions from Redis`
        });
      } catch (error) {
        console.error("Error clearing Redis data:", error);
        return NextResponse.json(
          { success: false, error: "Failed to clear Redis data" },
          { status: 500 }
        );
      }
    } else {
      // Redis not available, clear local file
      if (fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ responses: {} }, null, 2));
      }
      return NextResponse.json({
        success: true,
        message: "Cleared local data"
      });
    }
  } catch (error) {
    console.error("Error clearing data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear data" },
      { status: 500 }
    );
  }
}
