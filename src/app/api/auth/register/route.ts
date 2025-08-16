import User from "@/model/User";
import connectToDatabase from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "Email or Password Field Is Missing",
      },
      { status: 500 }
    );
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "User is Already Register with that email so try different" },
      {
        status: 400,
      }
    );
  } 
  await User.create({
    email,password
  })


  return NextResponse.json(
    {
      message: "User Register Sucessfullly",
    },
    { status: 200 }
  );
}
