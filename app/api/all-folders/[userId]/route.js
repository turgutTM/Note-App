import { NextResponse } from "next/server";
import connect from "@/db";
import Folder from "@/models/Folder";

export const GET = async (req, { params }) => {
  try {
    await connect();

    const { userId } = params;
    

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const folders = await Folder.find({ userID: userId }).sort({
      createdAt: -1,
    });

    if (folders.length === 0) {
      return new NextResponse("No folders found for this user", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(folders), { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
