import { useState, useRef, useEffect } from "react";

interface FaqItem {
  keywords: string[];
  response: string;
}

interface Props {
  faqs?: FaqItem[];
}

const FALLBACK_RESPONSES: [RegExp, string][] = [
  [/project|program|work/i, "ADA runs 6 programs: Food Distribution, Skills Training, Hospital Visits, Back-to-School, Clean Water, and Community Clean-Up."],
  [/donate|give|money/i, "Your donation makes a real difference. 80% goes directly to programs. Even $25 provides school supplies for 2 children."],
  [/volunteer|help|join/i, "We welcome volunteers in Cameroon and remotely! Roles include education mentoring, community outreach, and digital communications."],
  [/contact|email|phone/i, "Email info@apotidev.org or WhatsApp +237 676 282 346. Mon-Fri 8AM-5PM CAT."],
  [/impact|result/i, "Since 2021, we have impacted 200+ lives across 5 communities in Cameroon."],
  [/hours|open|when/i, "Our office is open Mon–Fri, 8AM–5PM CAT. You can also reach us anytime via WhatsApp at +237 676 282 346."],
  [/location|where|address/i, "We operate across Cameroon, with programs in Bamenda, Douala, Yaoundé, and rural communities in the Central Region."],
];

const DEFAULT = "I can help with info about our projects, donations, volunteering, or contact details. What would you like to know?";

export default function Chatbot({ faqs = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: DEFAULT },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  function getReply(msg: string): string {
    const lower = msg.toLowerCase();
    if (faqs.length) {
      for (const faq of faqs) {
        if (faq.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
          return faq.response;
        }
      }
    } else {
      for (const [re, reply] of FALLBACK_RESPONSES) if (re.test(msg)) return reply;
    }
    return DEFAULT;
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reply = getReply(text);
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setTyping(false);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {open && (
        <div role="dialog" aria-label="FAQ Chatbot" className="fixed bottom-24 right-6 z-50 w-80 max-h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          <div className="bg-green-600 text-white px-4 py-3 rounded-t-xl font-semibold flex justify-between items-center">
            <span>ADA Chat</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white hover:text-green-200">✕</button>
          </div>
          <div ref={logRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                {m.from === "bot" ? (
                  <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0">ADA</span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white flex-shrink-0">👤</span>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-lg ${m.from === "bot" ? "bg-gray-100 text-gray-800" : "bg-green-600 text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0">ADA</span>
                <div className="px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex border-t border-gray-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ADA..."
              aria-label="Type your question"
              className="flex-1 px-3 py-2 text-sm outline-none rounded-bl-xl"
            />
            <button type="submit" aria-label="Send message" className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 rounded-br-xl">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
