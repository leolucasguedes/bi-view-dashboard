import "./bootstrap";
import "../css/app.css";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ImpersonateProvider } from "./api/ImpersonateContext";
import { LoadingProvider, useLoading } from "./api/LoadingContext";
import { DarkModeProvider } from "./api/DarkModeContext";
import { UserProvider } from "./api/UserContext";
import { router as Inertia } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const MainApp = () => {
            const { loading, setLoading } = useLoading();

            useEffect(() => {
                const start = () => setLoading(true);
                const finish = () => setLoading(false);

                const startListener = Inertia.on("start", start);
                const finishListener = Inertia.on("finish", finish);

                return () => {
                    startListener();
                    finishListener();
                };
            }, [setLoading]);

            return <App {...props} />;
        };

        root.render(
            <DarkModeProvider>
                <UserProvider>
                    <LoadingProvider>
                        <ImpersonateProvider>
                            <MainApp />
                        </ImpersonateProvider>
                    </LoadingProvider>
                </UserProvider>
            </DarkModeProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
