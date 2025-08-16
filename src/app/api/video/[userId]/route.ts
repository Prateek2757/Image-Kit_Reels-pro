import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Image from "@/model/Image";
import Video from "@/model/Video";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Extract userId from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const userId = pathParts[pathParts.length - 1]; // last segment = userId

    if (!userId) {
      return NextResponse.json(
        { message: "userId not found" },
        { status: 400 }
      );
    }

    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    const videos = await Video.find({ userId }).sort({ createdAt: -1 });

    const media = [...images, ...videos];

    return NextResponse.json(media, { status: 200 });
  } catch (error) {
    console.error("fetch failed", error);

    return NextResponse.json(
      { error: "failed to fetch images and videos" },
      { status: 500 }
    );
  }
}