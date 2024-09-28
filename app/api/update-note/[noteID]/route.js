import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";

export const PUT = async (req, { params }) => {
  try {
    await connect();

    const noteID = params.noteID;
    const { content, title } = await req.json();

    if (!content) {
      return new NextResponse("Content is not found", { status: 404 });
    }

    const note = await Note.findByIdAndUpdate(
      noteID,
      { content, title },
      { new: true }
    );

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(note), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
