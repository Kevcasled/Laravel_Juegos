import { Head, Link } from '@inertiajs/react';

// Props: auth (objeto con auth.user o null)
export default function Welcome({ auth }) {
    return (
        <>
            <Head title="GamePlatform - Bienvenido" />
            <div className="min-h-screen bg-gray-950 text-white">
                {/* Navbar */}
                <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
                    <div className="flex items-center gap-2">
                        <svg
                            className="h-8 w-8 text-indigo-500"
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
                        <span className="text-xl font-bold tracking-tight text-white">
                            GamePlatform
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                            >
                                Ir al Panel
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-indigo-500 hover:text-white"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <main className="flex flex-col items-center justify-center px-6 py-24 text-center lg:py-40">
                    {/* Glow decorativo */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl"
                    />

                    <span className="mb-4 inline-block rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-300">
                        Plataforma de juegos online
                    </span>

                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-7xl">
                        Juega sin límites en{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            GamePlatform
                        </span>
                    </h1>

                    <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-400">
                        Descubre, juega y gestiona juegos en un solo lugar.
                        Una plataforma pensada para jugadores apasionados y
                        administradores que quieren llevar su catálogo al
                        siguiente nivel.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={route('register')}
                            className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-500 hover:shadow-indigo-600/40"
                        >
                            Empezar gratis
                        </Link>
                        <Link
                            href={route('login')}
                            className="rounded-xl border border-gray-700 px-8 py-3 text-base font-semibold text-gray-300 transition hover:border-indigo-500 hover:text-white"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </main>

                {/* Features */}
                <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-12">
                    <div className="grid gap-6 sm:grid-cols-3">
                        {[
                            {
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                ),
                                title: 'Juega al instante',
                                desc: 'Accede a todos los juegos publicados sin instalaciones. Todo en el navegador.',
                            },
                            {
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                ),
                                title: 'Gestión segura',
                                desc: 'Panel de administración con roles: admin, gestor y jugador.',
                            },
                            {
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                ),
                                title: 'Rendimiento óptimo',
                                desc: 'Experiencia fluida con tecnología moderna: Laravel + React + Inertia.',
                            },
                        ].map(({ icon, title, desc }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-indigo-700/60"
                            >
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20">
                                    <svg
                                        className="h-5 w-5 text-indigo-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        {icon}
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-base font-semibold text-white">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-400">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-800 px-6 py-6 text-center text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} GamePlatform. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}
