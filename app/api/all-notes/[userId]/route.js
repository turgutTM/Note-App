import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";
import Folder from "@/models/Folder";

export const GET = async (req, { params }) => {
  try {
    await connect();

    const { userId } = params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const notes = await Note.find({ userID: userId }).sort({ createdAt: -1 });

    if (notes.length === 0) {
      return new NextResponse("No notes found for this user", { status: 404 });
    }

    const notesWithFolders = await Promise.all(
      notes.map(async (note) => {
        const folder = await Folder.findById(note.folderId).lean();
        return {
          ...note._doc,
          folderName: folder ? folder.folderName : null,
        };
      })
    );

    return new NextResponse(JSON.stringify(notesWithFolders), { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
