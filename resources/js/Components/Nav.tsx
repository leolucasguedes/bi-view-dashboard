import { Fragment, useState, useContext, PropsWithChildren, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogoNav from "./ApplicationLogoNav";
import { CgProfile } from "react-icons/cg";
import {
    MdOutlineDashboard,
    MdOutlineContacts,
    MdOutlineTune,
} from "react-icons/md";
import { ImStatsBars } from "react-icons/im";
import { User } from "../types";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { impersonateContext } from "../api/ImpersonateContext";
import Loading from "../api/Loading";
import { RedePosition } from "./RedePosition";

const navigation = [
    { name: "Dashboard Geral", href: "/dashboard", icon: MdOutlineDashboard, current: false, },
    { name: "Filtro", href: "/filtro", icon: MdOutlineTune, current: false },
    { name: "Rankings", href: "/ranking", icon: ImStatsBars, current: false },
    { name: "Contatos", href: "/contato", icon: MdOutlineContacts, current: false, },
];

const userNavigation = [
    { name: "Perfil", href: "/perfil" },
    { name: "Sair", href: "/logout" },
];

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Nav({
    user,
    loading,
}: PropsWithChildren<{ user: User; loading: boolean }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const { person, setPerson } = useContext(impersonateContext);
    const isAdmin = user.is_admin === 1;

    const handleClick = () => {
        setPerson(false);
        localStorage.setItem("person", JSON.stringify(false));
    };

    function formatName(text: string) {
        const position1 = text.indexOf(" ");
        if (position1 !== -1) {
            return text.substring(0, position1);
        } else {
            return text;
        }
    }

    const userName = formatName(user.name);

    return (
        <>
            {loading && <Loading />}
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50 lg:hidden"
                        onClose={setSidebarOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <span className="sr-only">
                                                    Fechar Menu
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component mobile*/}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-light-dark px-6 pb-4">
                                        <div className="flex h-16 mt-4 shrink-0 items-center justify-center">
                                            <div className="pb-5 flex items-center justify-center">
                                                <ApplicationLogoNav />
                                            </div>
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul
                                                role="list"
                                                className="flex flex-1 flex-col gap-y-7"
                                            >
                                                <li>
                                                    <ul
                                                        role="list"
                                                        className="my-2 mx-10 space-y-4"
                                                    >
                                                        {navigation.map(
                                                            (item) => (
                                                                <li
                                                                    key={
                                                                        item.name
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        onClick={() =>
                                                                            setSidebarOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                        className={classNames(
                                                                            item.current
                                                                                ? "bg-custom-blue text-white font-poppins"
                                                                                : "text-custom-gray2 hover:text-white hover:bg-custom-blue font-poppins",
                                                                            "group flex gap-x-4 rounded-md p-2 text-sm leading-6 font-semibold"
                                                                        )}
                                                                    >
                                                                        <item.icon
                                                                            className={classNames(
                                                                                item.current
                                                                                    ? "text-white"
                                                                                    : "text-custom-gray2 group-hover:text-white",
                                                                                "h-6 w-6 shrink-0"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                                <div className="pl-16 mt-44">
                                                    <p>Direitos Reservados</p>
                                                </div>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* SideBar component desktop*/}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-light-dark px-6 pb-4">
                        <div className="flex items-center justify-center">
                            <ApplicationLogoNav />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul>
                                <hr className="border-t-2 border-custom-gray2 mb-2" />
                                <Link href="/perfil">
                                    <li className="flex items-center py-2 pr-4 hover:bg-custom-blue hover:text-white hover:rounded-md cursor-pointer">
                                        <CgProfile className="size-12 mr-2 pt-1 dark:text-white" />
                                        <div className="flex flex-col">
                                            <p className="text-16px font-semibold font-poppins dark:text-white">
                                                Olá{" "}
                                                <span className="font-bold">
                                                    {userName}
                                                </span>
                                                !
                                            </p>
                                            <RedePosition id={user.id} admin={isAdmin} />

                                        </div>
                                    </li>
                                </Link>
                                <hr className="border-t-2 border-custom-gray2 mt-3 mb-5" />
                            </ul>
                            <ul
                                role="list"
                                className="flex flex-1 flex-col gap-y-7"
                            >
                                <li>
                                    <ul role="list" className="mx-1 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() =>
                                                        setSidebarOpen(false)
                                                    }
                                                    className={classNames(
                                                        window.location
                                                            .pathname ===
                                                            item.href
                                                            ? "bg-custom-blue text-white font-poppins"
                                                            : "text-custom-gray2 hover:text-white hover:bg-custom-blue font-poppins",
                                                        "group flex gap-x-4 rounded-md p-2 text-sm leading-6 font-semibold"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            window.location
                                                                .pathname ===
                                                                item.href
                                                                ? "text-white"
                                                                : "text-custom-gray2 group-hover:text-white",
                                                            "h-6 w-6 shrink-0"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                            <div className="pl-8 mt-auto">
                                <p>Direitos Reservados</p>
                            </div>
                        </nav>
                    </div>
                </div>
                {/* Nav component*/}
                <div className="lg:pl-60">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-black px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Separator */}
                        <div
                            className="h-6 w-px bg-gray-900/10 lg:hidden"
                            aria-hidden="true"
                        />

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <form
                                className="relative flex flex-1"
                                action="#"
                                method="GET"
                            >
                                <label
                                    htmlFor="search-field"
                                    className="sr-only"
                                >
                                    Search
                                </label>
                                <input
                                    id="search-field"
                                    className="block h-[33px] w-full 2x1:w-[972px] bg-custom-gray my-2 mt-4 rounded-3xl focus:outline-none text-white font-poppins border-0 py-0 pl-6 pr-0 placeholder:text-gray-400 placeholder:text-14px focus:ring-0 sm:text-sm"
                                    type="search"
                                    name="search"
                                />
                                <MagnifyingGlassIcon
                                    className="pointer-events-none absolute inset-y-0 right-3.5 2x1:right-[375px] h-full w-4 text-white"
                                    aria-hidden="true"
                                />
                            </form>
                            <div className="flex items-center gap-x-4 lg:gap-6">
                                {/* Separator */}
                                <div
                                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                                    aria-hidden="true"
                                />
                                {/* Profile menu */}
                                <Menu as="div" className="relative">
                                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Menu</span>
                                        <CgProfile className="size-6 text-white" />
                                        <span className="hidden lg:flex lg:items-center">
                                            <span
                                                className="ml-4 text-sm font-semibold leading-6 text-white"
                                                aria-hidden="true"
                                            >
                                                {user.name}
                                            </span>
                                            <ChevronDownIcon
                                                className="ml-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-light-dark py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-50"
                                                                    : "",
                                                                "block px-3 py-1 text-sm leading-6 font-poppins text-gray-900 dark:text-white"
                                                            )}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">
                                        Notificações
                                    </span>
                                    <BellIcon
                                        className="h-5 w-5 ml-2"
                                        aria-hidden="true"
                                    />
                                    <Link
                                        href={route("impersonate.leave")}
                                        onClick={handleClick}
                                    >
                                        {person === true && (
                                            <div className="absolute top-16 right-4 bg-red-500 px-3 py-1 rounded-lg text-white font-montserrat text-14px">
                                                Voltar ao Perfil Original
                                            </div>
                                        )}
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
