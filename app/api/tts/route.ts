import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Sarah — warm, conversational (ElevenLabs free tier)
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export async function GET() {
  const available = !!process.env.ELEVENLABS_API_KEY;
  return NextResponse.json({
    available,
    engine: available ? "elevenlabs" : "browser",
    label: available ? "Natural voice (ElevenLabs)" : "Browser voice",
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs not configured", fallback: "browser" },
      { status: 501 }
    );
  }

  try {
    const { text } = (await req.json()) as { text: string };
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.32,
            similarity_boost: 0.75,
            style: 0.55,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `ElevenLabs error: ${err.slice(0, 200)}` },
        { status: res.status }
      );
    }

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "TTS generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
