import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sender = body?.sender;
    const message = body?.message;

    if (typeof sender !== "string" || typeof message !== "string" || !sender.trim() || !message.trim()) {
      return NextResponse.json({ error: "Invalid payload. Expect { sender: string, message: string }" }, { status: 400 });
    }

    const rasaRes = await fetch("http://localhost:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, message }),
    });

    const text = await rasaRes.text();
    return new Response(text, {
      status: rasaRes.status,
      headers: {
        "Content-Type": rasaRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to Rasa server" }, { status: 502 });
  }
}
