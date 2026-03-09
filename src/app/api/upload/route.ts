import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const blob = await put(`fbmp/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    urls.push(blob.url);
  }

  return NextResponse.json({ urls });
}
