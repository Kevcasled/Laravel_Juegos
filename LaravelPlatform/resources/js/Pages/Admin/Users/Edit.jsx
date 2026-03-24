import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

// Props:
//   user: { id, name, email, role }
//   auth: { user }
export default function UsersEdit({ user, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        role: user.role ?? 'jugador',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const roles = [
        { value: 'admin', label: 'Admin' },
        { value: 'gestor', label: 'Gestor' },
        { value: 'jugador', label: 'Jugador' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Editar Usuario
                </h2>
            }
        >
            <Head title={`Editar: ${user.name}`} />

            <div className="py-10">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nombre"
                                    className="text-gray-300"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Nombre completo"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="text-gray-300"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="usuario@ejemplo.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Rol */}
                            <div>
                                <InputLabel
                                    htmlFor="role"
                                    value="Rol"
                                    className="text-gray-300"
                                />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    {roles.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.role} className="mt-1" />
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Link
                                    href="/admin/users"
                                    className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
                                >
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
