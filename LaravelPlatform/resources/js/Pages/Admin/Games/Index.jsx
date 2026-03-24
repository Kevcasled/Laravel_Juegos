import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// Props:
//   games: Array<{ id, title, description, is_published, location, creator: { name } }>
//   auth: { user }
export default function GamesIndex({ games, auth }) {
    const handleTogglePublish = (game) => {
        router.patch(`/admin/games/${game.id}/toggle-publish`);
    };

    const handleDelete = (game) => {
        if (confirm(`¿Eliminar el juego "${game.title}"? Esta acción no se puede deshacer.`)) {
            router.delete(`/admin/games/${game.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Gestionar Juegos
                    </h2>
                    <Link
                        href="/admin/games/create"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        + Nuevo juego
                    </Link>
                </div>
            }
        >
            <Head title="Gestionar Juegos" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                        {games.length === 0 ? (
                            <div className="px-6 py-16 text-center text-gray-500">
                                No hay juegos todavía.{' '}
                                <Link
                                    href="/admin/games/create"
                                    className="text-indigo-400 hover:underline"
                                >
                                    Crea el primero
                                </Link>
                                .
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-800 bg-gray-800/50">
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Título
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Descripción
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Creador
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {games.map((game) => (
                                            <tr
                                                key={game.id}
                                                className="transition hover:bg-gray-800/40"
                                            >
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {game.title}
                                                </td>
                                                <td className="max-w-xs px-6 py-4 text-gray-400">
                                                    <span className="line-clamp-2">
                                                        {game.description || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {game.is_published ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                            Publicado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                                            No publicado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {game.creator?.name ?? '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/admin/games/${game.id}/edit`}
                                                            className="rounded-md border border-gray-700 px-3 py-1 text-xs font-medium text-gray-300 transition hover:border-indigo-500 hover:text-white"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleTogglePublish(game)}
                                                            className={
                                                                'rounded-md border px-3 py-1 text-xs font-medium transition ' +
                                                                (game.is_published
                                                                    ? 'border-red-700 text-red-400 hover:border-red-500 hover:text-red-300'
                                                                    : 'border-emerald-700 text-emerald-400 hover:border-emerald-500 hover:text-emerald-300')
                                                            }
                                                        >
                                                            {game.is_published ? 'Despublicar' : 'Publicar'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(game)}
                                                            className="rounded-md border border-gray-700 px-3 py-1 text-xs font-medium text-red-500 transition hover:border-red-600 hover:text-red-400"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
