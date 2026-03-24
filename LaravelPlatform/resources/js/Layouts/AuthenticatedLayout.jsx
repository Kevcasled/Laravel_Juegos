import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdminOrGestor = user?.role === 'admin' || user?.role === 'gestor';
    const isAdmin = user?.role === 'admin';

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-950">
            <nav className="border-b border-gray-800 bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo + nav links */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <svg
                                        className="h-7 w-7 text-indigo-500"
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
                                    <span className="text-sm font-bold text-white hidden sm:block">
                                        GamePlatform
                                    </span>
                                </Link>
                            </div>

                            {/* Desktop nav links por rol */}
                            <div className="hidden space-x-1 sm:-my-px sm:ms-8 sm:flex sm:items-center">
                                {isAdminOrGestor ? (
                                    <>
                                        <NavLink
                                            href="/dashboard"
                                            active={route().current('dashboard')}
                                            className="text-gray-300 hover:text-white"
                                        >
                                            Panel CRM
                                        </NavLink>
                                        <NavLink
                                            href="/admin/games"
                                            active={route().current('admin.games.*')}
                                            className="text-gray-300 hover:text-white"
                                        >
                                            Juegos
                                        </NavLink>
                                        {isAdmin && (
                                            <NavLink
                                                href="/admin/users"
                                                active={route().current('admin.users.*')}
                                                className="text-gray-300 hover:text-white"
                                            >
                                                Usuarios
                                            </NavLink>
                                        )}
                                    </>
                                ) : (
                                    <NavLink
                                        href="/games"
                                        active={route().current('games.*')}
                                        className="text-gray-300 hover:text-white"
                                    >
                                        Mis juegos
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* User dropdown (desktop) */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-300 transition duration-150 ease-in-out hover:border-indigo-500 hover:text-white focus:outline-none"
                                            >
                                                {user.name}
                                                {user.role && (
                                                    <span className="ms-2 rounded-full bg-indigo-600/30 px-2 py-0.5 text-xs text-indigo-300">
                                                        {user.role}
                                                    </span>
                                                )}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger (mobile) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((prev) => !prev)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-800 hover:text-gray-300 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {isAdminOrGestor ? (
                            <>
                                <ResponsiveNavLink href="/dashboard" active={route().current('dashboard')}>
                                    Panel CRM
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="/admin/games" active={route().current('admin.games.*')}>
                                    Juegos
                                </ResponsiveNavLink>
                                {isAdmin && (
                                    <ResponsiveNavLink href="/admin/users" active={route().current('admin.users.*')}>
                                        Usuarios
                                    </ResponsiveNavLink>
                                )}
                            </>
                        ) : (
                            <ResponsiveNavLink href="/games" active={route().current('games.*')}>
                                Mis juegos
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-800 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Cerrar sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-gray-900 shadow shadow-black/30">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
