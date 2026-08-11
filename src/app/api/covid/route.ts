import { NextResponse } from "next/server";
import { getCovidData } from "@/lib/server/covid";

export async function GET() {
  try {
    const payload = await getCovidData();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar os dados de COVID-19 agora." },
      { status: 502 }
    );
  }
}
