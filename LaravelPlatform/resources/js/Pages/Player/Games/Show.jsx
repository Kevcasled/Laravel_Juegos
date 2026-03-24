import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Obtiene el valor de una cookie por nombre.
 * Se usa para leer XSRF-TOKEN de las cookies de Laravel.
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Props:
//   game: { id, title, description, location }
//   auth: { user }
export default function GameShow({ game, auth }) {
    const [sessionId, setSessionId] = useState(null);
    const [sessionError, setSessionError] = useState(null);
    const [score, setScore] = useState(0);
    const iframeRef = useRef(null);

    // Al montar: inicia sesión de juego
    useEffect(() => {
        const startSession = async () => {
            try {
                const res = await fetch('/api/sessions/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
                        Accept: 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ game_id: game.id }),
                });

                if (res.ok) {
                    const json = await res.json();
                    setSessionId(json.session_id ?? json.id ?? null);
                }
            } catch (err) {
                // La sesión API es opcional; el juego sigue funcionando
                setSessionError('No se pudo iniciar la sesión de seguimiento.');
                console.warn('[GameShow] startSession error:', err);
            }
        };

        startSession();

        // Al desmontar: cierra la sesión de juego
        return () => {
            if (!sessionId) return;
            // Usamos sendBeacon para no bloquear el desmontaje
            const xsrf = getCookie('XSRF-TOKEN') ?? '';
            const blob = new Blob(
                [JSON.stringify({ score })],
                { type: 'application/json' },
            );
            navigator.sendBeacon(
                `/api/sessions/${sessionId}/end`,
                blob,
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game.id]);

    return (
        <>
            <Head title={game.title} />

            <div className="flex min-h-screen flex-col bg-gray-950">
                {/* Header de la plataforma */}
                <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/games"
                            className="flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Volver
                        </Link>
                        <span className="text-gray-700">|</span>
                        <div className="flex items-center gap-2">
                            <svg
                                className="h-5 w-5 text-indigo-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                />
                            </svg>
                            <span className="font-semibold text-white">
                                GamePlatform
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-gray-400 sm:block">
                            {game.title}
                        </span>
                        {auth?.user && (
                            <span className="rounded-full bg-indigo-600/20 px-2.5 py-0.5 text-xs text-indigo-300">
                                {auth.user.name}
                            </span>
                        )}
                    </div>
                </header>

                {/* Aviso de error de sesión (no bloquea el juego) */}
                {sessionError && (
                    <div className="bg-yellow-900/30 px-4 py-2 text-center text-xs text-yellow-400">
                        {sessionError}
                    </div>
                )}

                {/* Iframe del juego */}
                <div className="flex flex-1 flex-col">
                    {game.location ? (
                        <iframe
                            ref={iframeRef}
                            src={game.location}
                            title={game.title}
                            className="w-full flex-1 border-0"
                            style={{ minHeight: 'calc(100vh - 57px)' }}
                            allowFullScreen
                            allow="autoplay; fullscreen; gamepad"
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="text-center text-gray-500">
                                <svg
                                    className="mx-auto mb-3 h-12 w-12 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <p>Este juego no tiene una URL configurada.</p>
                                <Link
                                    href="/games"
                                    className="mt-3 inline-block text-sm text-indigo-400 hover:underline"
                                >
                                    Volver al catálogo
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
