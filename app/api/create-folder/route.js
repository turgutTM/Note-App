import { NextResponse } from "next/server";
import connect from "@/db";
import Folder from "@/models/Folder";

export const POST = async (req) => {
  try {
    await connect();
    const { folderName, userID } = await req.json();

    if (!folderName || !userID) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const newFolder = new Folder({ folderName, userID });
    await newFolder.save();

    return new NextResponse(JSON.stringify(newFolder), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
