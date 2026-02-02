import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), ".local-data.json");

export async function DELETE() {
  try {
    // Try to clear Vercel KV
    try {
      const { kv } = await import("@vercel/kv");
      const responseIds = await kv.smembers("response_ids");

      if (responseIds && responseIds.length > 0) {
        // Delete all response entries
        await Promise.all(
          responseIds.map(async (id) => {
            await kv.del(`response:${id}`);
          })
        );
        // Clear the response IDs set
        await kv.del("response_ids");
      }

      return NextResponse.json({
        success: true,
        message: `Cleared ${responseIds?.length || 0} submissions from Vercel KV`
      });
    } catch {
      // Vercel KV not available, clear local file
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
