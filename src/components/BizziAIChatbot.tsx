import React, { useState, useRef, useEffect } from 'react';
import {
    X,
    MessageSquare,
    Send,
    Bot,
    Sparkles,
    ChevronDown,
    MoreVertical,
    BarChart3,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ReferenceLine,
    Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { bizziAIQuestions, ChatMessage } from '@/data/bizziAIMock';
import { bizziAIFinancialMock } from '@/mock/bizziAI.financial.mock';
import bizziBotImg from '@/assets/Bizzi_Bot.png';

interface Message {
    id: string;
    type: 'user' | 'bot';
    text?: string;
    answerType?: 'text' | 'table' | 'summary';
    tableData?: {
        columns: string[];
        rows: (string | number)[][];
    };
    tables?: {
        title?: string;
        columns: string[];
        rows: (string | number)[][];
    }[];
    insight?: string;
    chartSuggestion?: {
        type: string;
        description: string;
        layout?: "horizontal" | "vertical";
        xAxis?: string;
        yAxis?: string;
        highlight?: string;
        threshold?: string;
        sort?: string;
        series?: { key: string; name: string; color?: string }[];
    };
    chartData?: any[];
    charts?: {
        suggestion: {
            type: "bar" | "line" | "pie" | "donut";
            description: string;
            layout?: "horizontal" | "vertical";
            xAxis?: string;
            yAxis?: string;
            threshold?: string;
            series?: { key: string; name: string; color?: string }[];
        };
        data: any[];
    }[];
    showChart?: boolean;
    isTyping?: boolean;
}

interface BizziAIChatbotProps {
    context?: 'consolidated' | 'management';
}

export function BizziAIChatbot({ context = 'consolidated' }: BizziAIChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', type: 'bot', text: 'Hello! I am BizziAI. How can I assist you?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeQuestions = context === 'management' ? bizziAIFinancialMock : bizziAIQuestions;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Show typing
        setIsTyping(true);

        // Matching logic
        setTimeout(() => {
            setIsTyping(false);

            // Simple keyword/substring matching
            const matchedQuestion = activeQuestions.find(q =>
                text.toLowerCase().includes(q.question.toLowerCase()) ||
                q.question.toLowerCase().includes(text.toLowerCase())
            );

            if (matchedQuestion) {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: (matchedQuestion as any).answerText || (matchedQuestion as any).answer || matchedQuestion.question,
                    answerType: (matchedQuestion as any).answerType,
                    tableData: (matchedQuestion as any).tableData,
                    tables: (matchedQuestion as any).tables,
                    insight: (matchedQuestion as any).insight,
                    chartSuggestion: (matchedQuestion as any).chartSuggestion,
                    chartData: (matchedQuestion as any).chartData,
                    charts: (matchedQuestion as any).charts,
                    showChart: false
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: "I couldn't find a specific answer for that. Could you please try rephrasing or selecting one of the suggested questions below?",
                };
                setMessages(prev => [...prev, botMsg]);
            }
        }, 800);
    };

    const handleSelectQuestion = (q: any) => {
        handleSendMessage(q.question);
    };

    const toggleChart = (msgId: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === msgId ? { ...msg, showChart: !msg.showChart } : msg
        ));
    };

    const COLORS = ['#4F46E5', '#60A5FA', '#34D399', '#FBBF24', '#F87171'];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Area Container */}
            {isOpen && (
                <div className="relative flex items-end">
                    {/* Swinging Bot Companion (Visual Only) */}
                    <div className="absolute right-full mr-6 bottom-0 w-28 h-28 hidden lg:block pointer-events-none animate-swing-float">
                        <img
                            src={bizziBotImg}
                            alt="BizziAI Companion"
                            className="w-full h-full object-contain filter drop-shadow-xl"
                        />
                    </div>

                    {/* Chat Panel */}
                    <div className="mb-4 w-80 sm:w-[500px] h-[650px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full border-2 border-primary-foreground/20 bg-white p-0.5 overflow-hidden shadow-inner">
                                    <img src={bizziBotImg} alt="BizziAI" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight text-white">BizziAI Assistant</h3>
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        <span className="text-[10px] opacity-90 uppercase tracking-[0.1em]">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-all active:scale-90"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex items-start gap-2.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        msg.type === 'user' ? "flex-row-reverse" : ""
                                    )}
                                >
                                    {msg.type === 'bot' && (
                                        <div className="h-8 w-8 rounded-full border border-border bg-white p-0.5 mt-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                                            <img src={bizziBotImg} alt="Bot" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed max-w-[90%]",
                                        msg.type === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none font-medium ml-auto"
                                            : "bg-white border border-border text-foreground rounded-tl-none font-medium"
                                    )}>
                                        {msg.text && (
                                            <div className={cn(
                                                msg.answerType === 'summary' ? "p-3 bg-primary/5 rounded-xl border border-primary/20 text-slate-800 font-semibold" : ""
                                            )}>
                                                {msg.text}
                                            </div>
                                        )}

                                        {msg.tableData && (
                                            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                                                <table className="w-full text-[11px] text-left">
                                                    <thead className="bg-slate-100 font-bold text-slate-700">
                                                        <tr>
                                                            {msg.tableData.columns.map((col, i) => (
                                                                <th key={i} className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-wider">{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {msg.tableData.rows.map((row, i) => (
                                                            <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                                                                {row.map((cell, j) => (
                                                                    <td key={j} className="px-3 py-2 whitespace-nowrap font-medium text-slate-600">{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {msg.tables && msg.tables.map((table, tIdx) => (
                                            <div key={tIdx} className="mt-4 first:mt-2">
                                                {table.title && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1.5 ml-1">{table.title}</p>}
                                                <div className="overflow-x-auto rounded-lg border border-border">
                                                    <table className="w-full text-[11px] text-left">
                                                        <thead className="bg-slate-100 font-bold text-slate-700">
                                                            <tr>
                                                                {table.columns.map((col, i) => (
                                                                    <th key={i} className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-wider">{col}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border">
                                                            {table.rows.map((row, i) => (
                                                                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                                                                    {row.map((cell, j) => (
                                                                        <td key={j} className="px-3 py-2 whitespace-nowrap font-medium text-slate-600">{cell}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}

                                        {msg.insight && (
                                            <div className="mt-3 flex gap-2 p-3 bg-indigo-50/50 text-indigo-900 rounded-xl border border-indigo-100 italic text-xs font-medium">
                                                <Sparkles className="h-4 w-4 shrink-0 text-indigo-500" />
                                                <span>{msg.insight}</span>
                                            </div>
                                        )}

                                        {msg.chartSuggestion && (
                                            <div className="mt-3 pt-3 border-t border-dashed border-border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-primary/5 text-primary rounded-lg">
                                                            <BarChart3 className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Suggested Chart</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleChart(msg.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
                                                    >
                                                        {msg.showChart ? "Hide Chart" : (msg.charts ? "View Analysis" : "View Chart")}
                                                    </button>
                                                </div>

                                                {msg.showChart && (
                                                    <div className="space-y-4">
                                                        {(msg.charts || (msg.chartSuggestion && msg.chartData ? [{ suggestion: msg.chartSuggestion, data: msg.chartData }] : [])).map((chart, idx) => (
                                                            <div key={idx} className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                                                <p className="text-[11px] font-bold text-slate-700 mb-4">{chart.suggestion.description}</p>
                                                                <div className="h-[200px] w-full">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        {chart.suggestion.type === 'bar' ? (
                                                                            <BarChart data={chart.data} layout={chart.suggestion.layout === 'horizontal' ? 'vertical' : 'horizontal'}>
                                                                                <CartesianGrid strokeDasharray="3 3" vertical={chart.suggestion.layout === 'horizontal'} stroke="#E2E8F0" horizontal={chart.suggestion.layout !== 'horizontal'} />
                                                                                {chart.suggestion.layout === 'horizontal' ? (
                                                                                    <>
                                                                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
                                                                                        <YAxis dataKey={chart.suggestion.xAxis || (chart.data[0]?.month ? "month" : "name")} type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} interval={0} width={80} />
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <XAxis dataKey={chart.suggestion.xAxis || (chart.data[0]?.month ? "month" : "name")} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} interval={0} />
                                                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
                                                                                    </>
                                                                                )}
                                                                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                                                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }} />
                                                                                {chart.suggestion.series ? (
                                                                                    chart.suggestion.series.map((s, i) => (
                                                                                        <Bar key={i} dataKey={s.key} name={s.name} fill={s.color || (i === 0 ? "hsl(var(--primary))" : "#94A3B8")} radius={chart.suggestion.layout === 'horizontal' ? [0, 4, 4, 0] : [4, 4, 0, 0]} />
                                                                                    ))
                                                                                ) : (
                                                                                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={chart.suggestion.layout === 'horizontal' ? [0, 4, 4, 0] : [4, 4, 0, 0]} />
                                                                                )}
                                                                            </BarChart>
                                                                        ) : chart.suggestion.type === 'line' ? (
                                                                            <LineChart data={chart.data}>
                                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                                                <XAxis dataKey={chart.suggestion.xAxis || "month"} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} interval={0} />
                                                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
                                                                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                                                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }} />
                                                                                {chart.suggestion.series ? (
                                                                                    chart.suggestion.series.map((s, i) => (
                                                                                        <Line key={i} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || (i === 0 ? "hsl(var(--primary))" : "#F87171")} strokeWidth={2} dot={{ r: 3 }} label={i === 0 ? { position: 'top', fontSize: 8, fill: '#64748B' } : false} />
                                                                                    ))
                                                                                ) : (
                                                                                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                                                                                )}
                                                                                {chart.suggestion.threshold && (
                                                                                    <ReferenceLine
                                                                                        y={parseFloat(chart.suggestion.threshold)}
                                                                                        stroke="#F87171"
                                                                                        strokeDasharray="5 5"
                                                                                        label={{ value: `Target: ${chart.suggestion.threshold}`, position: 'right', fill: '#F87171', fontSize: 8, fontWeight: 'bold' }}
                                                                                    />
                                                                                )}
                                                                            </LineChart>
                                                                        ) : (chart.suggestion.type === 'pie' || chart.suggestion.type === 'donut') ? (
                                                                            <PieChart>
                                                                                <Pie
                                                                                    data={chart.data}
                                                                                    cx="50%"
                                                                                    cy="50%"
                                                                                    innerRadius={chart.suggestion.type === 'donut' ? 40 : 0}
                                                                                    outerRadius={70}
                                                                                    paddingAngle={5}
                                                                                    dataKey="value"
                                                                                >
                                                                                    {chart.data.map((entry, index) => (
                                                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                                    ))}
                                                                                </Pie>
                                                                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                                                            </PieChart>
                                                                        ) : null}
                                                                    </ResponsiveContainer>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start gap-2.5">
                                    <div className="h-8 w-8 rounded-full border border-border bg-white p-0.5 mt-0.5 shrink-0 overflow-hidden shadow-sm">
                                        <img src={bizziBotImg} alt="Bot" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1.5">
                                            <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                            <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Question Selections */}
                        <div className="p-4 bg-white border-t border-border space-y-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 px-1">Common Questions</p>
                            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                {activeQuestions.slice(-2).map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => handleSelectQuestion(q as any)}
                                        disabled={isTyping}
                                        className="text-xs text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-primary/5 hover:text-primary border border-border/60 hover:border-primary/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                                    >
                                        {q.question}
                                    </button>
                                ))}
                            </div>

                            {/* Input Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(inputValue);
                                }}
                                className="mt-4 flex items-center gap-2"
                            >
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        disabled={isTyping}
                                        placeholder="Type your question here..."
                                        className="w-full h-11 px-4 pr-10 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all outline-none disabled:opacity-50"
                                    />
                                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30 group-focus-within:text-primary/60 transition-colors pointer-events-none" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-90 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary/20"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Bot Button */}
            <div className="relative group">
                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl">
                        BizziAI Assistant
                        <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-slate-900"></div>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "relative h-16 w-16 rounded-full shadow-2xl border-4 transition-all duration-500 flex items-center justify-center overflow-hidden",
                        isOpen ? "bg-card border-border rotate-180 scale-90" : "bg-white border-primary hover:scale-110 active:scale-95 animate-bounce-slow"
                    )}
                >
                    {isOpen ? (
                        <ChevronDown className="h-8 w-8 text-primary" />
                    ) : (
                        <div className="h-full w-full p-1.5 relative">
                            <img
                                src={bizziBotImg}
                                alt="BizziAI"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                </button>

                {/* Pulse effect when hidden */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10"></div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes swing-float {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          50% { transform: rotate(5deg) translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-swing-float {
          animation: swing-float 4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
      `}} />
        </div>
    );
}
