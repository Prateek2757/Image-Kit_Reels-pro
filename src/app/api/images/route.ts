import { Iimage } from "./../../../model/Image";
import connectToDatabase from "@/lib/dbConnect";
import Image from "@/model/Image";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

export async function GET() {
  await connectToDatabase();

  try {
    const images = await Image.find({}).sort({ createAt: -1 }).lean();

    if (images.length == 0 || !images) {
      return NextResponse.json(
        {
          message: "Images are not Found in Db",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(images);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "failed to fetch images",
      },
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unathorized Access",
        },
        {
          status: 400,
        }
      );
    }

    const imageData: Iimage = await request.json();

    if (
      !imageData.fileUrl ||
      !imageData.thumbnailUrl ||
      !imageData.description ||
      !imageData.title
    ) {
      return NextResponse.json(
        {
          error: "Missing Fileds",
        },
        {
          status: 402,
        }
      );
    }

    const newData = {
      ...imageData,
      userId: new mongoose.Types.ObjectId(session.user._id),
    };
    console.log(newData);

    const newImage = await Image.create(newData);
    console.log(new mongoose.Types.ObjectId(session.user._id));

    return NextResponse.json(newImage);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Filed to Upload image in Db",
      },
      {
        status: 401,
      }
    );
  }
}
