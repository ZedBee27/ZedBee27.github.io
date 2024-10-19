import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function DELETE(request: Request) {
  try {
    const { fileName } = await request.json();
      const  filePath  = fileName
      console.log(fileName)
      console.log(filePath)
      

    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 });
    }

    // Dynamically remove the /uploads/ path
    const file = filePath.replace('/uploads/', '');

    const fileToDelete = path.join(process.cwd(), 'public/uploads', file);

    try {
      // Check if the file exists
      await fs.access(fileToDelete);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete the file
    await fs.unlink(fileToDelete);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
