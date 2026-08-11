import { NextResponse } from "next/server";
import { getArbovirusData } from "@/lib/server/arbovirus";
import type { Disease } from "@/lib/types";

const VALID_DISEASES: Disease[] = ["dengue", "zika", "chikungunya"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const geocodeParam = searchParams.get("geocode");
  const diseaseParam = (searchParams.get("disease") ?? "dengue") as Disease;

  const geocode = Number(geocodeParam);
  if (!geocodeParam || Number.isNaN(geocode)) {
    return NextResponse.json(
      { error: "Parâmetro 'geocode' inválido ou ausente." },
      { status: 400 }
    );
  }
  if (!VALID_DISEASES.includes(diseaseParam)) {
    return NextResponse.json(
      { error: "Parâmetro 'disease' inválido." },
      { status: 400 }
    );
  }

  try {
    const payload = await getArbovirusData(geocode, diseaseParam);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar os dados agora." },
      { status: 502 }
    );
  }
}
