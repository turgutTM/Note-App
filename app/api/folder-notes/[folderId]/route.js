import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";

export const GET = async (req, { params }) => {
  try {
    await connect();

    const { folderId } = params;
    console.log(folderId);
    
    if (!folderId) {
      return new NextResponse("Folder ID is required", { status: 400 });
    }

    const notes = await Note.find({ folderId }).sort({ createdAt: -1 });

    if (notes.length === 0) {
      return new NextResponse("No notes found for this folder", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
