import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

// Props: auth { user }
export default function GamesCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location: '',
        is_published: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/games');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Nuevo Juego
                </h2>
            }
        >
            <Head title="Nuevo Juego" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="Título"
                                    className="text-gray-300"
                                />
                                <TextInput
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Nombre del juego"
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            {/* Descripción */}
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Descripción"
                                    className="text-gray-300"
                                />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    rows={4}
                                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Describe el juego..."
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            {/* Ubicación / URL */}
                            <div>
                                <InputLabel
                                    htmlFor="location"
                                    value="Ubicación / URL del juego"
                                    className="text-gray-300"
                                />
                                <TextInput
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={data.location}
                                    className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="https://ejemplo.com/juego o /games/mi-juego"
                                    onChange={(e) => setData('location', e.target.value)}
                                    required
                                />
                                <InputError message={errors.location} className="mt-1" />
                            </div>

                            {/* Publicado */}
                            <div className="flex items-center gap-3">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    name="is_published"
                                    checked={data.is_published}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                />
                                <InputLabel
                                    htmlFor="is_published"
                                    value="Publicar inmediatamente"
                                    className="mb-0 text-gray-300"
                                />
                                <InputError message={errors.is_published} className="mt-1" />
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Link
                                    href="/admin/games"
                                    className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
                                >
                                    {processing ? 'Guardando...' : 'Guardar juego'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
