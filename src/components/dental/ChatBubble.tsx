'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Typing indicator with three bouncing dots
function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Format timestamp to HH:MM
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBubble() {
  const { t, isRTL } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and welcome message on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t('chat.welcomeMessage'),
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, sessionId, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleNewConversation = useCallback(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: t('chat.welcomeMessage'),
        timestamp: new Date(),
      },
    ]);
    setInput('');
    setIsTyping(false);
  }, [t]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Build the messages array to send to the API
      const apiMessages = messages
        .filter((m) => m.id !== 'welcome') // exclude initial welcome
        .concat(userMessage)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, sessionId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch {
      // Fallback response using i18n key
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('chat.errorFallback'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }}
            className={`fixed bottom-[5.5rem] z-50 ${
              isRTL ? 'left-4' : 'right-4'
            } w-[calc(100vw-2rem)] sm:w-[400px] max-h-[75vh] sm:max-h-[540px] bg-white dark:bg-[#162236] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden`}
          >
            {/* Header with gradient */}
            <div
              className="px-4 py-3.5 flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #1E3A5F 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0C05A' }}>
                  <Bot className="w-4.5 h-4.5" style={{ color: '#1E3A5F' }} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold">ODG Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-blue-200 text-[10px]">En ligne</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNewConversation}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label={t('chat.newConversation')}
                  title={t('chat.newConversation')}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label={isRTL ? 'إغلاق' : 'Fermer'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[380px] custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="max-w-[80%] flex flex-col">
                    <div
                      className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'text-white rounded-2xl rounded-br-md'
                          : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#1a2d45] rounded-2xl rounded-bl-md'
                      }`}
                      style={msg.role === 'user' ? { backgroundColor: '#1E3A5F' } : {}}
                    >
                      {msg.content}
                    </div>
                    <span className={`text-[10px] text-gray-400 dark:text-gray-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ backgroundColor: '#F0C05A' }}
                    >
                      <User className="w-3.5 h-3.5" style={{ color: '#1E3A5F' }} />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-[#1a2d45] rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#0f1d2e]/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRTL ? 'اكتب رسالتك...' : 'Tapez votre message...'}
                  aria-label={isRTL ? 'اكتب رسالتك' : 'Votre message'}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-white dark:bg-[#1a2d45] rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7AB0E0] focus:ring-2 focus:ring-[#1E3A5F]/10 dark:focus:ring-[#7AB0E0]/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{ backgroundColor: '#1E3A5F' }}
                  aria-label={isRTL ? 'إرسال' : 'Envoyer'}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
        style={{ backgroundColor: isOpen ? '#64748b' : '#1E3A5F' }}
        aria-label={isOpen ? (isRTL ? 'إغلاق المحادثة' : 'Fermer la discussion') : (isRTL ? 'فتح المحادثة' : 'Ouvrir la discussion')}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#F0C05A' }} />
          </>
        )}
      </motion.button>
    </>
  );
}
