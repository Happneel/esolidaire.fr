import { NextRequest, NextResponse } from "next/server";
import { trouverMairie } from "@/lib/mairieAnnuaire";

export async function GET(request: NextRequest) {
  const commune = request.nextUrl.searchParams.get("commune")?.trim();
  if (!commune) {
    return NextResponse.json({ error: "Paramètre commune manquant" }, { status: 400 });
  }
  const resultat = await trouverMairie(commune);
  return NextResponse.json(resultat);
}
