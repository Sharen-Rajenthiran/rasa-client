'use client';
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(
    [
      {
        id: 1,
        role: "assistant" as const,
        text: "Hello, Welcome to UTM. How may i assist you today?",
        style: "short",
      },
      { id: 2, role: "user" as const, text: "Course registration", style: "chip" },
      {
        id: 3,
        role: "assistant" as const,
        text:
          "Thank you for your inquiry. The course registration period for Semester 1, 2025/2026 academic session is scheduled as follows:\n\nRegistration Date: 22-25 September 2025\n\nPlease ensure you complete your course registration within this period. You can access the registration portal at http://amd.utm.my\n\nIs there anything else you would like to know about the registration process?",
        style: "long",
      },
    ] as { id: number; role: "assistant" | "user"; text: string; style?: "short" | "long" | "chip" }[]
  );

  const historyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const PLACEHOLDER: Record<string, string> = {
    "course registration period":
      "The course registration period for Semester 1, 2025/2026 is 22–25 September 2025. Please complete your registration within this period at http://amd.utm.my.",
    "Course Information":
      "Course information, credit hours, and prerequisites will be available here. Please check back soon.",
    "Timetable Generation":
      "Timetable generation guidance will appear here. This will be populated once the API is connected.",
    "Study Plan Guidance":
      "Study plan guidance will be displayed here based on your program and intake session.",
    FAQs:
      "Frequently asked questions will appear here. In the meantime, feel free to ask anything.",
  };

  function appendUserAndBot(userText: string) {
    const nextId = messages.length + 1;
    const botText = PLACEHOLDER[userText] ||
      `Thanks for your message about "${userText}". A detailed response will appear here once the API is available.`;
    setMessages((m) => [
      ...m,
      { id: nextId, role: "user", text: userText, style: "chip" },
      { id: nextId + 1, role: "assistant", text: botText, style: "long" },
    ]);
  }

  function handleSend() {
    const value = input.trim();
    if (!value) return;
    appendUserAndBot(value);
    setInput("");
  }

  const quickReplies = [
    "course registration period",
    "Course Information",
    "Timetable Generation",
    "Study Plan Guidance",
    "FAQs",
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black flex items-start justify-center py-6">
      <main className="w-full max-w-4xl border border-black rounded-none bg-white">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center text-lg">🤖</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-semibold">UTM Campus Assistance Chatbot</h1>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">✓</span>
              </div>
              <div className="text-xs text-zinc-600 leading-4">Online - Available 24/7</div>
              <div className="text-xs text-zinc-600 leading-4">Course Registration & Academic Information Support</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-y border-black/70 px-4 h-10">
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <span className="inline-block h-4 w-4 rounded-full border border-zinc-500" />
            <span>Conversation History</span>
          </div>
          <div className="text-xs border border-zinc-400 rounded-full px-3 py-1">{messages.length} messages</div>
        </div>

        <div ref={historyRef} className="px-4 py-4 space-y-6 max-h-[520px] overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="w-full">
              {m.role === "assistant" ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-zinc-200 flex items-center justify-center text-lg">🤖</div>
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-500">UTM Assistant · Today</div>
                    <div
                      className={
                        m.style === "short"
                          ? "mt-1 inline-block rounded-full bg-black text-white px-4 py-2 text-sm"
                          : "mt-2 inline-block max-w-[720px] rounded-3xl bg-black text-white px-4 py-4 text-sm"
                      }
                    >
                      {m.text.split("\n").map((line, i) => (
                        <p key={i} className="leading-6">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-end gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500">Student · Today</div>
                    <div className="mt-1 inline-block bg-green-600 text-white text-sm px-4 py-2 rounded-full">
                      {m.text}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center">👤</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-black/70 px-4 py-3">
          <div className="text-sm mb-2">Quick replies:</div>
          <div className="grid grid-cols-3 gap-3">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => appendUserAndBot(qr)}
                className="h-9 rounded-md bg-zinc-200 text-zinc-800 text-sm px-3 text-left hover:bg-zinc-300"
              >
                {qr}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-black/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 h-10 rounded-md border border-zinc-400 px-3 text-sm outline-none"
            />
            <button
              onClick={handleSend}
              className="h-10 w-10 rounded-md bg-zinc-800 text-white flex items-center justify-center hover:bg-black"
              aria-label="Send"
            >
              ▶
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
