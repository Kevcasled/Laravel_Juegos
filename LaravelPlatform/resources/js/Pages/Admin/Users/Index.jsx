import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Badge de color por rol
function RoleBadge({ role }) {
    const styles = {
        admin: 'bg-red-500/15 text-red-400',
        gestor: 'bg-violet-500/15 text-violet-400',
        jugador: 'bg-indigo-500/15 text-indigo-400',
    };
    return (
        <span
            className={
                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ' +
                (styles[role] ?? 'bg-gray-700 text-gray-400')
            }
        >
            {role}
        </span>
    );
}

// Props:
//   users: Array<{ id, name, email, role }>
//   auth: { user }
export default function UsersIndex({ users, auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Gestionar Usuarios
                </h2>
            }
        >
            <Head title="Gestionar Usuarios" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                        {users.length === 0 ? (
                            <div className="px-6 py-16 text-center text-gray-500">
                                No hay usuarios registrados.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-800 bg-gray-800/50">
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Rol
                                            </th>
                                            <th className="px-6 py-3 font-medium text-gray-400">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition hover:bg-gray-800/40"
                                            >
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {user.name}
                                                    {user.id === auth.user.id && (
                                                        <span className="ms-2 text-xs text-gray-600">
                                                            (tú)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="rounded-md border border-gray-700 px-3 py-1 text-xs font-medium text-gray-300 transition hover:border-indigo-500 hover:text-white"
                                                    >
                                                        Editar
                                                    </Link>
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
