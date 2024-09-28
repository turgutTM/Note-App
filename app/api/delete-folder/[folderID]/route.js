import { NextResponse } from "next/server";
import connect from "@/db";
import Note from "@/models/Note";
import Folder from "@/models/Folder";

export const DELETE = async (req) => {
  try {
    await connect();
    const { folderID } = await req.json();

    if (!folderID) {
      return new NextResponse("Folder ID is required", { status: 400 });
    }
    const folder = await Folder.findByIdAndDelete(folderID);

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    await Note.updateMany({ folderId: folderID }, { $unset: { folderId: "" } });

    return new NextResponse(JSON.stringify(folder), { status: 200 });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
