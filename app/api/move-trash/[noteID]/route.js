import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";

export const PUT = async (req) => {
  try {
    await connect();

    const noteID = req.url.split("/").pop();

    if (!noteID) {
      return new NextResponse("Note ID is required", { status: 400 });
    }

    const note = await Note.findById(noteID);

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteID,
      { isDeleted: !note.isDeleted },
      { new: true }
    );

    return new NextResponse(JSON.stringify(updatedNote), { status: 200 });
  } catch (error) {
    console.error("Error moving note to trash:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
