import { NextResponse } from "next/server";
import { getAllResponses } from "@/lib/storage";

export async function GET() {
  try {
    const responses = await getAllResponses();
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}
