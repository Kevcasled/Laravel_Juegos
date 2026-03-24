import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Props: auth { user: { id, name, email, role } }
export default function AdminDashboard({ auth }) {
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Panel de Administración
                </h2>
            }
        >
            <Head title="Panel de Administración" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Bienvenida */}
                    <div className="mb-8">
                        <p className="text-gray-400">
                            Bienvenido,{' '}
                            <span className="font-semibold text-white">
                                {auth.user.name}
                            </span>
                            . Aquí tienes acceso rápido a las funciones del panel.
                        </p>
                    </div>

                    {/* Cards de navegación */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Gestionar Juegos */}
                        <Link
                            href="/admin/games"
                            className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-indigo-600 hover:bg-gray-800/60"
                        >
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
                                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-white">
                                Gestionar Juegos
                            </h3>
                            <p className="text-sm text-gray-400">
                                Crea, edita, publica o elimina juegos de la plataforma.
                            </p>
                            <span className="mt-4 inline-block text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
                                Ir a juegos &rarr;
                            </span>
                        </Link>

                        {/* Gestionar Usuarios — solo admin */}
                        {isAdmin && (
                            <Link
                                href="/admin/users"
                                className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-violet-600 hover:bg-gray-800/60"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 transition group-hover:bg-violet-600/30">
                                    <svg
                                        className="h-6 w-6 text-violet-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-white">
                                    Gestionar Usuarios
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Administra los usuarios registrados y sus roles.
                                </p>
                                <span className="mt-4 inline-block text-xs font-medium text-violet-400 group-hover:text-violet-300">
                                    Ir a usuarios &rarr;
                                </span>
                            </Link>
                        )}

                        {/* Stats placeholder */}
                        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20">
                                <svg
                                    className="h-6 w-6 text-emerald-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-white">
                                Estadísticas
                            </h3>
                            <p className="text-sm text-gray-400">
                                Próximamente: sesiones, puntuaciones y más métricas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
