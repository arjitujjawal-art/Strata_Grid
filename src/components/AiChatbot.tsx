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
    label: '📊 Road Stress Score',
    prompt: 'How is the Road Stress Score (0-100) calculated and what are its tiers?',
    mode: 'general'
  },
  {
    label: '🔄 8-Stage Pipeline',
    prompt: 'Can you walk through the 8 stages of the StrataGrid AI pipeline from ingestion to feedback loop?',
    mode: 'simulation'
  },
  {
    label: '🎛️ Dashboard Modes',
    prompt: 'What is the difference between Driver Mode, Fleet Mode, and City Mode?',
    mode: 'general'
  },
  {
    label: '👥 Who Benefits & Impact',
    prompt: 'Who benefits from StrataGrid AI and what is the urban impact on traffic and infrastructure?',
    mode: 'roi'
  },
  {
    label: '📶 3 Data Levels',
    prompt: 'How does StrataGrid scale across Level 1, Level 2, and Level 3 data levels without mandatory hardware?',
    mode: 'simulation'
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
      <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Header 3
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-headline font-bold text-white text-sm sm:text-base mt-2 mb-1 flex items-center gap-1.5 text-emerald-400">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-emerald-400 font-bold">•</span>
                <span className="text-slate-200" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          // Tables or horizontal rules
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            return (
              <div key={idx} className="font-mono text-[11px] bg-slate-900/80 p-1.5 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                {trimmed}
              </div>
            );
          }

          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          return (
            <p key={idx} className="text-slate-200" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-emerald-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px]">$1</code>');
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-fadeIn">
          {/* Subtle Attention Badge */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101726]/90 border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-xl shadow-emerald-500/10 cursor-pointer hover:border-emerald-400 hover:scale-105 transition-all backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Ask Infrastructure AI</span>
          </div>

          <button
            id="ai-chatbot-toggle-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open StrataGrid AI Copilot"
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-[#090d16] font-bold shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-emerald-300/40 group"
          >
            <Bot className="w-7 h-7 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#090d16] animate-ping" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#090d16] flex items-center justify-center text-[9px] font-mono text-black font-bold">
              AI
            </span>
          </button>
        </div>
      )}

      {/* Floating Chatbot Modal Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col bg-[#101726]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[94vw] sm:w-[680px] h-[86vh] sm:h-[720px]'
              : 'w-[94vw] sm:w-[440px] h-[560px] sm:h-[620px]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900/90 via-[#131d2e] to-slate-900/90 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-white text-sm sm:text-base tracking-tight">
                    StrataGrid AI Copilot
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Gemini 3.7
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Infrastructure & Geotechnical Intelligence
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Normal View' : 'Expand View'}
                className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Selector Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {[
              { id: 'general', label: '🛡️ Core AI', icon: Sparkles },
              { id: 'simulation', label: '📊 H3 Grid', icon: Layers },
              { id: 'geotech', label: '🌧️ Soil & Strain', icon: CloudRain },
              { id: 'roi', label: '💰 Fiscal ROI', icon: DollarSign }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as ChatMode)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  activeMode === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 shadow-lg transition-all ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-medium border border-emerald-400/30 rounded-tr-none'
                      : 'bg-[#152033]/90 text-slate-200 border border-slate-700/70 rounded-tl-none space-y-2'
                  }`}
                >
                  {msg.sender === 'assistant' ? (
                    <>
                      {msg.text ? (
                        <>
                          {renderFormattedText(msg.text)}
                          {isLoading && msg.id === messages[messages.length - 1]?.id && (
                            <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse ml-1 rounded-xs align-middle" />
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 py-1 text-slate-400 font-mono text-xs">
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                          <span>Generating response...</span>
                        </div>
                      )}

                      {/* Footer Actions for Assistant Message */}
                      {msg.text && (
                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-emerald-400" />
                            <span>{msg.source || 'gemini-3.7-flash'}</span>
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {onNavigatePage && (
                              <button
                                onClick={() => {
                                  setIsOpen(false);
                                  onNavigatePage('demo');
                                }}
                                className="text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>Test Grid</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs sm:text-[13px] whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompt Pills */}
          <div className="px-3 py-2 bg-[#0d1422] border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
              <span className="text-slate-500 shrink-0 text-[10px] uppercase">Suggest:</span>
              {SUGGESTED_PROMPTS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 shrink-0 transition-all cursor-pointer"
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
            className="p-3 bg-[#0d1422] border-t border-emerald-500/20 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Stop Listening' : 'Voice Input'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about Road Stress Scores, 8-stage pipeline, modes..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
