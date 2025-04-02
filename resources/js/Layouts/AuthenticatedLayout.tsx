import { PropsWithChildren, ReactNode, useState, useEffect } from "react";
import Nav from "../Components/Nav";
import { User } from "../types";
import { useLoading } from "../api/LoadingContext";
import { useDarkMode } from '../api/DarkModeContext';
import Loading from "../api/Loading";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { loading } = useLoading();

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {loading && <Loading />}
            <Nav user={user} loading={loading} />
            <button
                onClick={toggleDarkMode}
                className="absolute right-4 top-3 p-2 rounded-full bg-gray-200 dark:bg-gray-200 z-50"
            >
                {isDarkMode ? (
                    <MdOutlineWbSunny className="h-5 w-5 text-yellow-500" />
                ) : (
                    <IoMoonOutline className="h-5 w-5 text-gray-700" />
                )}
            </button>
            {header && (
                <header className="bg-gray dark:bg-heavy-dark">
                    <div className="max-w-7xl sm:pt-7 px-4 md:px-10">
                        {header}
                    </div>
                </header>
            )}
            <main className="lg:ml-60 min-h-screen dark:bg-heavy-dark">{children}</main>
        </div>
    );
}
