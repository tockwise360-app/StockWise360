'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am your StockWise AI assistant. How can I help you manage your business today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Mock AI Response logic
        setTimeout(() => {
            let responseContent = "I'm not sure about that yet.";
            const lowerInput = userMessage.content.toLowerCase();

            if (lowerInput.includes('stock') || lowerInput.includes('inventory')) {
                responseContent = "Your inventory looks healthy overall. You have 5 items running low on stock. Would you like me to list them?";
            } else if (lowerInput.includes('invoice') || lowerInput.includes('bill')) {
                responseContent = "You can create a new invoice by going to the Invoices tab and clicking 'New Invoice'. I can also help you draft one if you tell me the items.";
            } else if (lowerInput.includes('profit') || lowerInput.includes('sales')) {
                responseContent = "Based on your dashboard, your sales are up 12.5% this month! Great job.";
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                responseContent = "Hi there! Ready to optimize your business?";
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <PageContainer>
            <PageHeader
                title="AI Assistant"
                description="Ask about your inventory, sales, or business tips"
            />

            <div className="rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-card flex flex-col h-[calc(100vh-280px)]">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50 dark:bg-white/5 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                                }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                        ? 'bg-brand-teal text-white'
                                        : 'bg-slate-200 dark:bg-white/10 text-teal-600 dark:text-teal-400'
                                    }`}
                            >
                                {msg.role === 'user' ? <User size={18} strokeWidth={2} /> : <Bot size={18} strokeWidth={2} />}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`px-4 py-3 rounded-2xl leading-relaxed text-sm ${msg.role === 'user'
                                        ? 'bg-brand-teal text-white rounded-br-sm'
                                        : 'bg-white dark:bg-dark-elevated text-slate-900 dark:text-white rounded-bl-sm border border-slate-200 dark:border-white/10'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-4 max-w-[80%] self-start">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-200 dark:bg-white/10 text-teal-600 dark:text-teal-400">
                                <Bot size={18} strokeWidth={2} />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-dark-elevated border border-slate-200 dark:border-white/10">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border flex gap-4">
                    <input
                        type="text"
                        className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-full text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-teal transition-all"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-teal hover:bg-teal-600 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={18} strokeWidth={2} />
                        Send
                    </button>
                </div>
            </div>
        </PageContainer>
    );
}
