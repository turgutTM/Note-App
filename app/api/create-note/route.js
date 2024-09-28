import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";

export const POST = async (req) => {
  try {
    await connect();
    const { userID, title, content } = await req.json();

    if (!userID || !content || !title) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const newNote = new Note({ userID, content, title });
    await newNote.save();

    return new NextResponse(JSON.stringify(newNote), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
