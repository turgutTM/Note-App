import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";

export const DELETE = async (req) => {
  try {
    await connect();
    const noteID = req.url.split("/").pop();

    if (!noteID) {
      return new NextResponse("Note ID is required", { status: 400 });
    }

    const deletedNotes = await Note.findByIdAndDelete(noteID);

    if (!deletedNotes) {
      return new NextResponse("Note not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(deletedNotes), { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};