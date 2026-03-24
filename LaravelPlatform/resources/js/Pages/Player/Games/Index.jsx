import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Props:
//   games: Array<{ id, title, description, location }>
//   auth: { user }
export default function PlayerGamesIndex({ games, auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Juegos disponibles
                </h2>
            }
        >
            <Head title="Juegos disponibles" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {games.length === 0 ? (
                        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
                            <svg
                                className="mx-auto mb-4 h-12 w-12 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                />
                            </svg>
                            <p className="text-gray-500">
                                Todavía no hay juegos publicados. ¡Vuelve pronto!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {games.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function GameCard({ game }) {
    return (
        <div className="group flex flex-col rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden transition hover:border-indigo-700/60 hover:shadow-lg hover:shadow-indigo-900/20">
            {/* Cabecera decorativa */}
            <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-indigo-900/60 to-violet-900/60">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"
                />
                <svg
                    className="relative h-12 w-12 text-indigo-400/60 transition group-hover:text-indigo-400/90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                </svg>
            </div>

            {/* Contenido */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-base font-semibold text-white transition group-hover:text-indigo-300">
                    {game.title}
                </h3>
                <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-400">
                    {game.description || 'Sin descripción disponible.'}
                </p>
                <Link
                    href={`/games/${game.id}`}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-700/20 transition hover:bg-indigo-500 hover:shadow-indigo-600/30 active:scale-95"
                >
                    <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    Jugar
                </Link>
            </div>
        </div>
    );
}
