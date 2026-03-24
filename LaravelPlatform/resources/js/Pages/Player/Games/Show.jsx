import { Head, Link } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Props: game { id, title, description, location }, auth { user }
export default function GameShow({ game, auth }) {
    const [sessionId, setSessionId]         = useState(null);
    const [score]                           = useState(0);
    const [modelsReady, setModelsReady]     = useState(false);
    const [camError, setCamError]           = useState(null);
    const [lastEmotion, setLastEmotion]     = useState(null);
    const videoRef                          = useRef(null);
    const sessionIdRef                      = useRef(null);
    const intervalRef                       = useRef(null);

    // Mantener sessionIdRef sincronizado
    useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

    // 1. Iniciar sesión de juego
    useEffect(() => {
        const start = async () => {
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
                console.warn('[GameShow] startSession error:', err);
            }
        };
        start();

        return () => {
            if (!sessionIdRef.current) return;
            const blob = new Blob([JSON.stringify({ score })], { type: 'application/json' });
            navigator.sendBeacon(`/api/sessions/${sessionIdRef.current}/end`, blob);
        };
    }, [game.id]);

    // 2. Cargar modelos de face-api.js
    useEffect(() => {
        faceapi.nets.tinyFaceDetector.loadFromUri('/models')
            .then(() => faceapi.nets.faceExpressionNet.loadFromUri('/models'))
            .then(() => setModelsReady(true))
            .catch((err) => console.warn('[face-api] Error cargando modelos:', err));
    }, []);

    // 3. Arrancar webcam cuando los modelos estén listos
    useEffect(() => {
        if (!modelsReady) return;

        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(() => {
                setCamError('No se pudo acceder a la cámara. La detección de emociones está desactivada.');
            });

        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
            }
        };
    }, [modelsReady]);

    // 4. Detectar emociones cada 3 segundos y enviarlas a la API
    useEffect(() => {
        if (!modelsReady || camError) return;

        const gameStartTime = Date.now();

        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) return;

            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (!detection) return;

            // Emoción dominante
            const expressions = detection.expressions;
            const dominant = Object.entries(expressions).reduce((a, b) => a[1] > b[1] ? a : b);
            const [emotion, confidence] = dominant;
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);

            setLastEmotion({ emotion, confidence });

            // Enviar solo si hay sesión activa
            if (!sessionIdRef.current) return;

            fetch('/api/emotions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    session_id: sessionIdRef.current,
                    emotion,
                    confidence: parseFloat(confidence.toFixed(4)),
                    elapsed_seconds: elapsed,
                }),
            }).catch((err) => console.warn('[face-api] Error enviando emoción:', err));

        }, 3000);

        return () => clearInterval(intervalRef.current);
    }, [modelsReady, camError]);

    const emotionEmoji = { happy: '😊', sad: '😢', angry: '😠', surprised: '😲', neutral: '😐', disgusted: '🤢', fearful: '😨' };

    return (
        <>
            <Head title={game.title} />

            <div className="flex min-h-screen flex-col bg-gray-950">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link href="/games" className="flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </Link>
                        <span className="text-gray-700">|</span>
                        <span className="font-semibold text-white">{game.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Indicador de emoción */}
                        {lastEmotion && !camError && (
                            <span className="hidden items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 sm:flex">
                                <span>{emotionEmoji[lastEmotion.emotion] ?? '🎮'}</span>
                                <span className="capitalize">{lastEmotion.emotion}</span>
                                <span className="text-gray-500">({Math.round(lastEmotion.confidence * 100)}%)</span>
                            </span>
                        )}
                        {auth?.user && (
                            <span className="rounded-full bg-indigo-600/20 px-2.5 py-0.5 text-xs text-indigo-300">
                                {auth.user.name}
                            </span>
                        )}
                    </div>
                </header>

                {/* Aviso de cámara */}
                {camError && (
                    <div className="bg-yellow-900/30 px-4 py-2 text-center text-xs text-yellow-400">
                        {camError}
                    </div>
                )}

                {/* Contenido principal */}
                <div className="relative flex flex-1 flex-col">
                    {/* Iframe del juego */}
                    {game.location ? (
                        <iframe
                            src={game.location}
                            title={game.title}
                            className="w-full flex-1 border-0"
                            style={{ minHeight: 'calc(100vh - 57px)' }}
                            allowFullScreen
                            allow="autoplay; fullscreen; gamepad"
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <p className="text-gray-500">Este juego no tiene una URL configurada.</p>
                        </div>
                    )}

                    {/* Webcam oculta para face-api */}
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="pointer-events-none absolute bottom-4 right-4 h-48 w-64 rounded-lg border border-gray-700 object-cover"
                    />
                </div>
            </div>
        </>
    );
}
