import { NextResponse } from "next/server";
import connect from "@/db";
import Folder from "@/models/Folder";

export const GET = async (request, { params }) => {
  try {
    const { id } = params;
    console.log("geder ha " + id);

    await connect();

    const folder = await Folder.findById(id);

    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(folder, { status: 200 });
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
