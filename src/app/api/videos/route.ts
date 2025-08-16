import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import connectToDatabase from "@/lib/dbConnect";
import Video, { IVideo } from "@/model/Video";
import mongoose from "mongoose";
import Image from "@/model/Image";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    //console.log(videos);

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();
    console.log(body);
    console.log(body.fileUrl);

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.fileUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new video with default values
    const videoData = {
      ...body,
      userId: new mongoose.Types.ObjectId(session.user._id),
    };
    console.log(session.user._id);

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id, type } = await req.json(); // Expecting { id: "123", type: "image" | "video" }

    if (!id || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let deletedItem;
    if (type === "image") {
      deletedItem = await Image.findByIdAndDelete(id);
    } else if (type === "video") {
      deletedItem = await Video.findByIdAndDelete(id);
    } else {
      return NextResponse.json(
        { message: "Invalid media type" },
        { status: 400 }
      );
    }

    if (!deletedItem) {
      return NextResponse.json({ message: "Media not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
