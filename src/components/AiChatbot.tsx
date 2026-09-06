import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Copy, 
  Check, 
  Mic, 
  MicOff, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  CloudRain, 
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Volume2,
  VolumeX,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, ChatMode, PageId } from '../types';

interface AiChatbotProps {
  onNavigatePage?: (page: PageId) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: `### 🛡️ Welcome to StrataGrid AI Assistant!

I can answer questions about the **StrataGrid AI** system, including:

* **The Problem & Solution** — Why traditional GPS routing accelerates infrastructure decay and how we solve both traffic and road stress as one unified problem.
* **Road Stress Score (0–100)** — How traffic load, vehicle load factors (car, bus, truck, heavy truck), weather multipliers, and road vulnerability calculate cell stress.
* **8-Stage System Pipeline** — From data ingestion to ML prediction and modified Dijkstra/A* cooperative routing.
* **Dashboard Modes & Scalability** — Driver Mode, Fleet Mode, City Mode, and Level 1–3 data integration tiers.

*Select a suggested topic below or ask any question!*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'gemini-3.7-flash'
  }
];

const SUGGESTED_PROMPTS: { label: string; prompt: string; mode: ChatMode }[] = [
  {
    label: '🌧️ Pune Monsoon Stress',
    prompt: 'Why does the Hinjewadi-Wakad corridor face critical pavement failure when rainfall reaches 75mm/h?',
    mode: 'general'
  },
  {
    label: '🚚 PCCOE Freight Bypass',
    prompt: 'How does StrataGrid AI geo-fence and reroute heavy multi-axle freight away from PCCOE and residential Akurdi?',
    mode: 'simulation'
  },
  {
    label: '📊 Road Stress Score',
    prompt: 'How is the Road Stress Score (0-100) calculated using traffic, vehicle weights, and weather multipliers?',
    mode: 'geotech'
  },
  {
    label: '🔄 Cooperative vs Selfish',
    prompt: 'How does cooperative load-balancing differ from Google Maps selfish routing, and why does it save roads?',
    mode: 'simulation'
  },
  {
    label: '👥 Who Benefits & ROI',
    prompt: 'Who benefits from StrataGrid AI and what is the municipal capital repair cost avoidance for cities like Pune?',
    mode: 'roi'
  },
  {
    label: '👥 Core Team',
    prompt: 'Who is on the StrataGrid AI core team and what are their roles?',
    mode: 'general'
  }
];

export const AiChatbot: React.FC<AiChatbotProps> = ({ onNavigatePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Listen for Ask AI requests from H3 Hex Inspector
  useEffect(() => {
    const handleAskAi = (e: any) => {
      const { prompt, mode } = e.detail || {};
      if (prompt) {
        setIsOpen(true);
        if (mode) setActiveMode(mode);
        setTimeout(() => handleSendMessage(prompt), 100);
      }
    };
    window.addEventListener('stratagrid_ask_ai', handleAskAi);
    return () => window.removeEventListener('stratagrid_ask_ai', handleAskAi);
  }, []);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botMessageId = `bot-${Date.now()}`;
    const initialBotMessage: ChatMessage = {
      id: botMessageId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.7-flash'
    };

    setMessages(prev => [...prev, userMessage, initialBotMessage]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      // 1. Try real-time streaming endpoint for instant first-token delivery
      const streamResponse = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          mode: activeMode
        })
      });

      if (streamResponse.ok && streamResponse.body) {
        const reader = streamResponse.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let detectedSource = 'gemini-3.7-flash';
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) {
                  accumulatedText += data.chunk;
                  if (data.source) detectedSource = data.source;

                  setMessages(prev =>
                    prev.map(m =>
                      m.id === botMessageId
                        ? { ...m, text: accumulatedText, source: detectedSource }
                        : m
                    )
                  );
                }
              } catch (parseErr) {
                // ignore parse error on partial chunks
              }
            }
          }
        }

        if (accumulatedText.trim()) {
          setIsLoading(false);
          if (!isOpen) setUnreadCount(prev => prev + 1);
          return;
        }
      }

      // 2. Fallback to fast synchronous endpoint if stream returned empty
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          mode: activeMode
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev =>
        prev.map(m =>
          m.id === botMessageId
            ? {
                ...m,
                text: data.reply || 'Analysis complete.',
                source: data.source || 'gemini-3.7-flash'
              }
            : m
        )
      );

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error fetching chat response:', err);
      const fallbackText = `### 🛡️ StrataGrid AI Overview

StrataGrid AI is an AI-powered traffic orchestration system that routes vehicles based not only on travel time, but also on the predicted health of the road network.

* **Road Stress Score:** 0–100 dynamic rating across H3 hexagonal grid cells.
* **8-Stage Pipeline:** From multimodal data ingestion to modified Dijkstra/A* cooperative routing.
* **Dashboard Modes:** Driver Mode, Fleet Mode, and City Mode.`;

      setMessages(prev =>
        prev.map(m =>
          m.id === botMessageId
            ? {
                ...m,
                text: fallbackText,
                source: 'domain-copilot'
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        sender: 'assistant',
        text: '🧹 Chat history reset. Ask me anything about StrataGrid AI geotechnical modeling or simulation metrics!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini-3.7-flash'
      }
    ]);
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your current browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Simple clean markdown formatter for assistant responses
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed font-body">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Header 3
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-display font-bold text-[#D4AF37] text-sm sm:text-base mt-3 mb-1.5 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#D4AF37] font-bold">♦</span>
                <span className="text-[#F2F0E4]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          // Tables or horizontal rules
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            return (
              <div key={idx} className="font-mono text-[11px] bg-[#0A0A0A] p-2 border border-[#D4AF37]/30 text-[#F2F0E4] overflow-x-auto">
                {trimmed}
              </div>
            );
          }

          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          return (
            <p key={idx} className="text-[#F2F0E4]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#F2E8C4] font-bold font-display uppercase tracking-wider">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-[#D4AF37]">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[11px]">$1</code>');
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button in Art Deco Rotated Diamond */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 animate-in fade-in select-none font-body">
          {/* Attention Badge */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#141414] border border-[#D4AF37] text-[10px] font-display uppercase tracking-[0.2em] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>CONSULT AI FORENSICS</span>
          </div>

          <button
            id="ai-chatbot-toggle-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open StrataGrid AI Copilot"
            className="relative w-12 h-12 deco-diamond bg-[#141414] border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="deco-diamond-inner">
              <Bot className="w-6 h-6 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rotate-45 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rotate-45" />
          </button>
        </div>
      )}

      {/* Floating Chatbot Modal Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col bg-[#141414]/98 backdrop-blur-2xl border-2 border-[#D4AF37] shadow-[0_0_45px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300 font-body select-none ${
            isExpanded
              ? 'w-[94vw] sm:w-[680px] h-[86vh] sm:h-[720px]'
              : 'w-[94vw] sm:w-[440px] h-[560px] sm:h-[620px]'
          }`}
        >
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />

          {/* Header */}
          <div className="p-4 bg-[#0A0A0A] border-b border-[#D4AF37]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 deco-diamond bg-[#141414] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <div className="deco-diamond-inner">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-[#F2F0E4] text-sm sm:text-base tracking-[0.15em] uppercase">
                    STRATAGRID AI ASSISTANT
                  </h3>
                  <span className="text-[9px] font-display font-bold px-2 py-0.5 bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/60 uppercase tracking-wider">
                    GEMINI 3.7
                  </span>
                </div>
                <p className="text-[10px] font-body uppercase tracking-[0.2em] text-[#888888] mt-0.5">
                  CIVIL & GEOTECHNICAL INTELLIGENCE
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5 text-[#888888]">
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-1.5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                aria-label="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Normal View' : 'Expand View'}
                className="p-1.5 hover:text-[#D4AF37] transition-colors cursor-pointer hidden sm:block"
                aria-label="Toggle Expand"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="p-1.5 hover:text-[#991B1B] transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Selector Chips */}
          <div className="px-3 py-2.5 bg-[#0A0A0A] border-b border-[#D4AF37]/30 flex items-center gap-2 overflow-x-auto text-[10px] font-display tracking-[0.15em] uppercase scrollbar-none">
            {[
              { id: 'general', label: 'CORE AI' },
              { id: 'simulation', label: 'H3 MESH' },
              { id: 'geotech', label: 'SOIL & STRAIN' },
              { id: 'roi', label: 'CAPITAL ROI' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as ChatMode)}
                className={`px-3 py-1 shrink-0 transition-all cursor-pointer border ${
                  activeMode === tab.id
                    ? 'bg-[#141414] text-[#D4AF37] font-bold border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                    : 'text-[#888888] border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:text-[#F2F0E4]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[84%] p-4 shadow-lg transition-all ${
                    msg.sender === 'user'
                      ? 'bg-[#1E3D59] text-[#F2F0E4] border border-[#D4AF37]/60'
                      : 'bg-[#0A0A0A] text-[#F2F0E4] border-l-2 border-[#D4AF37] border-y border-r border-[#D4AF37]/30 space-y-2'
                  }`}
                >
                  {msg.sender === 'assistant' ? (
                    <>
                      {msg.text ? (
                        <>
                          {renderFormattedText(msg.text)}
                          {isLoading && msg.id === messages[messages.length - 1]?.id && (
                            <span className="inline-block w-2 h-3.5 bg-[#D4AF37] animate-pulse ml-1 align-middle" />
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 py-1 text-[#888888] text-xs font-mono uppercase tracking-wider">
                          <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                          <span>Consulting geotechnical knowledge...</span>
                        </div>
                      )}

                      {/* Footer Actions for Assistant Message */}
                      {msg.text && (
                        <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[10px] font-body tracking-[0.15em] text-[#888888] uppercase">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-[#D4AF37]" />
                            <span>{msg.source || 'gemini-3.7-flash'}</span>
                          </span>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-[#D4AF37]" />
                                  <span className="text-[#D4AF37]">COPIED</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>COPY</span>
                                </>
                              )}
                            </button>

                            {onNavigatePage && (
                              <button
                                onClick={() => {
                                  setIsOpen(false);
                                  onNavigatePage('dashboard');
                                }}
                                className="text-[#D4AF37] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                              >
                                <span>3D MESH</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs sm:text-[13px] whitespace-pre-wrap tracking-wide">{msg.text}</p>
                  )}
                </div>

                <span className="text-[9px] font-mono text-[#888888] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompt Pills */}
          <div className="px-3 py-2 bg-[#0A0A0A] border-t border-[#D4AF37]/30">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-body uppercase tracking-[0.15em]">
              <span className="text-[#888888] shrink-0">SUGGEST:</span>
              {SUGGESTED_PROMPTS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="px-2.5 py-1 bg-[#141414] hover:bg-[#D4AF37] text-[#888888] hover:text-[#0A0A0A] border border-[#D4AF37]/40 hover:border-[#D4AF37] shrink-0 transition-all cursor-pointer font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0A0A0A] border-t-2 border-[#D4AF37] flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Stop Listening' : 'Voice Input'}
              className={`p-2.5 border transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#991B1B] border-[#991B1B] text-[#F2E8C4] animate-pulse'
                  : 'bg-[#141414] border-[#D4AF37]/40 text-[#888888] hover:text-[#D4AF37]'
              }`}
              aria-label="Toggle voice recognition"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about Pune corridors, AASHTO fatigue, or flood risk..."
              className="deco-input flex-1 text-xs sm:text-sm placeholder-[#888888]/60"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="deco-btn-solid p-2.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
