import React, { useState, useEffect, useRef } from "react";
import { fetchResponse } from "./utils/fetchResponse";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
} from "lucide-react";

// Message type
type ChatMessage = {
  id: number;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  status: "sent" | "read";
  quickReplies?: string[];
};

const SophiaWhatsAppChatbot: React.FC = () => {
  // 🌐 Persistent Language Selection
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "es"
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      text:
        language === "es"
          ? "¡Hola! 👋 Soy el Asistente Virtual de Laboratorios Sophia. Estoy aquí para ayudarte con información sobre nuestros productos oftálmicos, educación médica continua, y más.\n\n¿En qué puedo asistirte hoy?"
          : "Hello! 👋 I’m the Virtual Assistant of Sophia Laboratories. I can help with product info, education, and more.\n\nHow can I assist you today?",
      timestamp: new Date(Date.now() - 2000),
      status: "read",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🌍 Persist language
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);

  // ✉️ Send user message and fetch bot reply
  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      type: "user",
      text,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setShowQuickReplies(false);
    setIsTyping(true);

    const reply = await fetchResponse(text, language, setMessages);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: reply,
        timestamp: new Date(),
        status: "read",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => sendMessage(reply);
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const MessageStatus = ({ status }: { status: string }) => {
    if (status === "sent") return <Check size={16} className="text-gray-400" />;
    if (status === "delivered")
      return <CheckCheck size={16} className="text-gray-400" />;
    if (status === "read")
      return <CheckCheck size={16} className="text-blue-400" />;
    return null;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <ArrowLeft size={24} />
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#075E54]">
            SL
          </div>
          <div>
            <div className="font-semibold">Sophia Laboratorios</div>
            <div className="text-xs text-gray-200">
              {language === "es"
                ? "Asistente Virtual • En línea"
                : "Virtual Assistant • Online"}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border border-white/30"
            title={
              language === "es" ? "Switch to English" : "Cambiar a Español"
            }
          >
            {language === "es" ? "🇬🇧 EN" : "🇪🇸 ES"}
          </button>
          <Video size={22} />
          <Phone size={22} />
          <MoreVertical size={22} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5] relative">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-md ${
                msg.type === "user"
                  ? "bg-[#DCF8C6] translate-x-1"
                  : "bg-white translate-x-0"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.text}</div>

              {/* Quick Replies */}
              {msg.quickReplies &&
                msg.quickReplies.length > 0 &&
                showQuickReplies &&
                msg.type === "bot" && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="block w-full text-left bg-white border border-[#075E54] text-[#075E54] px-3 py-2 rounded text-xs hover:bg-[#075E54] hover:text-white transition"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp)}
                </span>
                {msg.type === "user" && <MessageStatus status={msg.status} />}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white rounded-lg px-4 py-3 shadow">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Quick Reply Buttons */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {(language === "es"
            ? [
                {
                  label: "🩺 Productos glaucoma",
                  query: "Información sobre productos para glaucoma",
                },
                {
                  label: "💧 Tratamiento ojo seco",
                  query:
                    "Necesito información sobre tratamientos para ojo seco",
                },
                {
                  label: "🎓 Cursos CME",
                  query: "Quiero información sobre cursos y educación médica",
                },
                {
                  label: "🛒 Solicitar muestras",
                  query: "Me gustaría solicitar muestras de productos",
                },
                {
                  label: "📅 Agendar cita",
                  query: "Quiero agendar una cita con un representante",
                },
              ]
            : [
                {
                  label: "🩺 Glaucoma products",
                  query: "Information about glaucoma products",
                },
                {
                  label: "💧 Dry eye treatment",
                  query: "I need information about dry eye treatments",
                },
                {
                  label: "🎓 CME Courses",
                  query:
                    "I want information about continuing medical education courses",
                },
                {
                  label: "🛒 Request samples",
                  query: "I would like to request product samples",
                },
                {
                  label: "📅 Schedule appointment",
                  query:
                    "I want to schedule an appointment with a representative",
                },
              ]
          ).map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(scenario.query)}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs whitespace-nowrap transition"
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-[#F0F0F0] px-4 py-2 flex items-center gap-2 border-t border-gray-300">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            language === "es" ? "Escribe tu consulta..." : "Type your query..."
          }
          className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-[#075E54] text-white rounded-full p-2 hover:bg-[#064940] transition"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce { animation: bounce 0.6s infinite; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SophiaWhatsAppChatbot;
