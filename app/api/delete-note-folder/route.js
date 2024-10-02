import { NextResponse } from "next/server";
import connect from "@/db";
import Folder from "@/models/Folder";
import Note from "@/models/Note";

export const DELETE = async (req) => {
  try {
    await connect();

    const { folderId, noteId } = await req.json();

    if (!folderId || !noteId) {
      return new NextResponse("Folder ID and Note ID are required", {
        status: 400,
      });
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { $pull: { notes: noteId } },
      { new: true }
    );

    if (!updatedFolder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $pull: { folderId: folderId } },
      { new: true }
    );

    if (!updatedNote) {
      return new NextResponse("Note not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify({ updatedFolder, updatedNote }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting note from folder:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
