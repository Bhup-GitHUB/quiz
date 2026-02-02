import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveResponse } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, answers, timestamp } = body;

    // Generate a unique ID for this response
    const id = randomUUID();

    // Create the response object
    const response = {
      id,
      name,
      answers,
      submittedAt: timestamp,
    };

    // Store the response
    await saveResponse(id, response);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save response" },
      { status: 500 }
    );
  }
}
