import { useEffect, useRef, useState } from "react";

interface FaqItem {
  keywords: string[];
  keywordsFr?: string[];
  response: string;
}

interface Props {
  faqs?: FaqItem[];
  locale?: "en" | "fr";
}

const FALLBACK_RESPONSES: [RegExp, string, string][] = [
  [
    /project|program|work|projet|programme|activit/i,
    "ADA runs 6 programs: Food Distribution, Skills Training, Hospital Visits, Back-to-School, Clean Water, and Community Clean-Up.",
    "ADA mène 6 programmes : distribution alimentaire, formation professionnelle, visites à l’hôpital, rentrée scolaire, accès à l’eau potable et nettoyage communautaire.",
  ],
  [
    /donate|give|money|don|donner|argent|imp[oô]t|re[cç]u/i,
    "Your donation makes a real difference. 80% goes directly to programs. Even $25 provides school supplies for 2 children.",
    "Votre don fait une réelle différence. 80 % des dons sont directement affectés aux programmes. Un don de 25 $ permet de fournir du matériel scolaire à deux enfants.",
  ],
  [
    /volunteer|help|join|b[eé]n[eé]vol|aider|rejoindre/i,
    "We welcome volunteers in Cameroon and remotely! Roles include education mentoring, community outreach, and digital communications.",
    "Nous accueillons les bénévoles au Cameroun et à distance ! Les missions comprennent le mentorat scolaire, la mobilisation communautaire et les communications numériques.",
  ],
  [
    /contact|email|phone|courriel|t[eé]l[eé]phone|joindre|whatsapp/i,
    "Email info@apotidev.org or WhatsApp +237 676 282 346. Mon-Fri 8AM-5PM CAT.",
    "Écrivez à info@apotidev.org ou contactez-nous sur WhatsApp au +237 676 282 346. Du lundi au vendredi, de 8 h à 17 h (heure du Cameroun).",
  ],
  [
    /impact|result|r[eé]sultat/i,
    "Since 2021, we have impacted 200+ lives across 5 communities in Cameroon.",
    "Depuis 2021, nous avons soutenu plus de 200 personnes dans 5 communautés au Cameroun.",
  ],
  [
    /hours|open|when|horaire|ouvert|heure/i,
    "Our office is open Mon–Fri, 8AM–5PM CAT. You can also reach us anytime via WhatsApp at +237 676 282 346.",
    "Nos bureaux sont ouverts du lundi au vendredi, de 8 h à 17 h (heure du Cameroun). Vous pouvez aussi nous joindre à tout moment sur WhatsApp au +237 676 282 346.",
  ],
  [
    /location|where|address|lieu|o[uù]|adresse/i,
    "We operate across Cameroon, with programs in Bamenda, Douala, Yaoundé, and rural communities in the Central Region.",
    "Nos programmes sont menés au Cameroun, notamment à Bamenda, Douala, Yaoundé et dans des communautés rurales de la Région du Centre.",
  ],
];

const DEFAULT = {
  en: "I can help with info about our projects, donations, volunteering, or contact details. What would you like to know?",
  fr: "Je peux vous renseigner sur nos projets, les dons, le bénévolat ou nos coordonnées. Que souhaitez-vous savoir ?",
};

export default function Chatbot({ faqs = [], locale = "en" }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([{ from: "bot", text: DEFAULT[locale] }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  function getReply(msg: string): string {
    const lower = msg.toLowerCase();
    if (faqs.length) {
      for (const faq of faqs) {
        const keywords =
          locale === "fr"
            ? [...faq.keywords, ...(faq.keywordsFr || [])]
            : faq.keywords;
        if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
          return faq.response;
        }
      }
    } else {
      for (const [re, replyEn, replyFr] of FALLBACK_RESPONSES)
        if (re.test(msg)) return locale === "fr" ? replyFr : replyEn;
    }
    return DEFAULT[locale];
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
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
        aria-label={
          open
            ? locale === "fr"
              ? "Fermer la discussion"
              : "Close chat"
            : locale === "fr"
              ? "Ouvrir la discussion"
              : "Open chat"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="ada-chat-dialog"
        className="fixed z-50 w-12 h-12 rounded-md bg-primary-700 text-white border border-primary-800 flex items-center justify-center hover:bg-primary-800 transition-colors"
        style={{
          right: "max(1rem, env(safe-area-inset-right))",
          bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {open && (
        <div
          id="ada-chat-dialog"
          role="dialog"
          aria-label={
            locale === "fr"
              ? "Assistant de questions fréquentes"
              : "FAQ Chatbot"
          }
          className="fixed z-50 bg-[#faf8f4] rounded-md border border-gray-200 flex flex-col"
          style={{
            right: "max(1rem, env(safe-area-inset-right))",
            bottom: "max(5rem, calc(env(safe-area-inset-bottom) + 4rem))",
            width: "min(20rem, calc(100vw - 2rem))",
            maxHeight:
              "min(28rem, calc(100dvh - env(safe-area-inset-top) - 7rem))",
          }}
        >
          <div className="bg-primary-800 text-white px-4 py-3 rounded-t-md font-heading font-semibold flex justify-between items-center">
            <span>{locale === "fr" ? "Discussion ADA" : "ADA Chat"}</span>
            <button
              onClick={() => setOpen(false)}
              aria-label={
                locale === "fr" ? "Fermer la discussion" : "Close chat"
              }
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto p-3 space-y-2 text-sm"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.from === "bot" ? (
                  <span className="w-6 h-6 rounded-md bg-primary-700 flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0">
                    ADA
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-md bg-gray-600 flex items-center justify-center text-[10px] text-white flex-shrink-0">
                    {locale === "fr" ? "Vous" : "You"}
                  </span>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-md ${m.from === "bot" ? "bg-white border border-gray-200 text-gray-800" : "bg-primary-700 text-white"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-md bg-primary-700 flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0">
                  ADA
                </span>
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-md">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex border-t border-gray-200"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                locale === "fr"
                  ? "Posez une question sur ADA…"
                  : "Ask about ADA..."
              }
              aria-label={
                locale === "fr"
                  ? "Saisissez votre question"
                  : "Type your question"
              }
              className="flex-1 px-3 py-2 text-sm outline-none rounded-bl-md bg-white"
            />
            <button
              type="submit"
              aria-label={
                locale === "fr" ? "Envoyer le message" : "Send message"
              }
              className="px-4 py-2 bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 rounded-br-md"
            >
              {locale === "fr" ? "Envoyer" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
