import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Props: auth { user: { id, name, email, role } }
export default function PlayerDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Mis Juegos
                </h2>
            }
        >
            <Head title="Mis Juegos" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Saludo */}
                    <div className="mb-8">
                        <p className="text-gray-400">
                            ¡Hola,{' '}
                            <span className="font-semibold text-white">
                                {auth.user.name}
                            </span>
                            ! ¿Listo para jugar?
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card principal: ver juegos */}
                        <Link
                            href="/games"
                            className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-indigo-600 hover:bg-gray-800/60"
                        >
                            {/* Glow de fondo */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-700/20 blur-2xl transition group-hover:bg-indigo-600/30"
                            />

                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 transition group-hover:bg-indigo-600/30">
                                <svg
                                    className="h-6 w-6 text-indigo-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-white">
                                Ver juegos disponibles
                            </h3>
                            <p className="text-sm text-gray-400">
                                Explora el catálogo completo de juegos publicados y empieza a jugar.
                            </p>
                            <span className="mt-4 inline-block text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
                                Explorar catálogo &rarr;
                            </span>
                        </Link>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
