import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = db.select().from(products).orderBy(desc(products.createdAt));

  const rows = await query;
  const filtered = status ? rows.filter((r) => r.status === status) : rows;

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const [product] = await db
    .insert(products)
    .values({
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      condition: body.condition || "used_good",
      location: body.location || "Gippsland, VIC",
      images: body.images || [],
    })
    .returning();

  return NextResponse.json(product, { status: 201 });
}
