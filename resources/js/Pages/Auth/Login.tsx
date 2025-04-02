import { useState, useEffect, FormEventHandler } from "react";
import Checkbox from "../../Components/Checkbox";
import GuestLayout from "../../Layouts/GuestLayout";
import InputError from "../../Components/InputError";
import InputLabel from "../../Components/InputLabel";
import PrimaryButton from "../../Components/PrimaryButton";
import TextInput from "../../Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    const translateErrorMessage = (
        message: string | string[] | undefined
    ): string | undefined => {
        if (Array.isArray(message)) {
            return message
                .map((msg) => {
                    switch (msg) {
                        case "These credentials do not match our records.":
                            return "As credenciais estão incorretas ou não correspondem.";
                        default:
                            return msg;
                    }
                })
                .join(", ");
        } else if (typeof message === "string") {
            switch (message) {
                case "These credentials do not match our records.":
                    return "As credenciais estão incorretas ou não correspondem.";
                default:
                    return message;
            }
        }
        return message;
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="E-mail ou WhatsApp"
                    />

                    <TextInput
                        id="email"
                        type="text"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError
                        message={translateErrorMessage(errors.email)}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 relative">
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="off"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-8 right-0.5 flex items-center pr-3"
                    >
                        {showPassword ? (
                            <IoMdEyeOff className="h-6 w-6 text-gray-800" />
                        ) : (
                            <IoMdEye className="h-6 w-6 text-gray-800" />
                        )}
                    </button>

                    <InputError
                        message={translateErrorMessage(errors.password)}
                        className="mt-2"
                    />
                </div>

                <div className="block mt-6">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Lembrar de mim
                        </span>
                    </label>
                </div>

                <PrimaryButton className="-ms-2 sm:ms-7" disabled={processing}>
                    Login
                </PrimaryButton>
                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Esqueceu sua senha?
                        </Link>
                    )}
                </div>
            </form>
        </GuestLayout>
    );
}
