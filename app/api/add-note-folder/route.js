import { NextResponse } from "next/server";
import connect from "@/db";
import Folder from "@/models/Folder";
import Note from "@/models/Note";

export const POST = async (req) => {
  try {
    await connect();

    const { noteId, folderId } = await req.json();

    if (!noteId || !folderId) {
      return new NextResponse("Both noteId and folderId are required", {
        status: 400,
      });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    if (note.folderId.length > 0 && !note.folderId.includes(folderId)) {
      return new NextResponse("Note is already in another folder", {
        status: 400,
      });
    }

    if (!note.folderId.includes(folderId)) {
      note.folderId.push(folderId);
      await note.save();
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    if (!folder.notes.includes(noteId)) {
      folder.notes.push(noteId);
      await folder.save();
    }

    return new NextResponse("Note added to folder successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding note to folder:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
