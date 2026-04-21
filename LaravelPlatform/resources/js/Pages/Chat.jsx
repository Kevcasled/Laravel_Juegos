import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Chat({ messages: initialMessages }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        const channel = window.Echo.channel('chat');
        channel.listen('MessageSend', (e) => {
            setMessages((prev) => [...prev, e.message]);
        });
        return () => window.Echo.leaveChannel('chat');
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const submit = async (e) => {
        e.preventDefault();
        if (!content.trim() || sending) return;
        setSending(true);
        try {
            await axios.post(route('messages.store'), { content });
            setContent('');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (iso) =>
        new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-100 leading-tight">
                    Sala de Chat
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-4">
                    {/* Lista de mensajes */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-6 h-[520px] overflow-y-auto flex flex-col gap-3">
                        {messages.length === 0 && (
                            <p className="text-gray-500 text-sm text-center mt-auto">
                                No hay mensajes aún. ¡Sé el primero!
                            </p>
                        )}
                        {messages.map((msg) => {
                            const isOwn = msg.user.id === auth.user.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                                        {msg.user.name[0]}
                                    </div>
                                    <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                                        <span className="text-xs text-gray-400 mb-1">
                                            {msg.user.name}
                                        </span>
                                        <div
                                            className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                                                isOwn
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-800 text-gray-100'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    {/* Formulario de envío */}
                    <form
                        onSubmit={submit}
                        className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-4 flex gap-3"
                    >
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            maxLength={1000}
                            className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={sending || !content.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {sending ? '...' : 'Enviar'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
