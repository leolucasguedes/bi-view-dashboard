import { useState } from "react";
import axios from "axios";
import GuestLayout from "../../Layouts/GuestLayout";
import InputError from "../../Components/InputError";
import PrimaryButton from "../../Components/PrimaryButton";
import TextInput from "../../Components/TextInput";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        whatsapp: "",
    });

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!data.email || !data.whatsapp) {
            setAlertMessage("Ambos os campos são obrigatórios.");
            return;
        }

        try {
            const response = await axios.post("password", {
                email: data.email,
                whatsapp: data.whatsapp,
            });

            if (response.data.success) {
                setUserName(response.data.user.name);
                setPassword(response.data.user.password);
                setAlertMessage("");
            } else {
                setAlertMessage(response.data.message);
            }
        } catch (error: any) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setAlertMessage(error.response.data.message);
            } else {
                setAlertMessage(
                    "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
                );
            }
        }
    };

    const resetForm = () => {
        setUserName("");
        setPassword("");
        reset();
        setAlertMessage("");
        router.visit("/login");
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Senha" />

            <div className="mb-4 text-sm text-gray-600">
                Esqueceu sua senha? Sem problemas. Informe seu email e número de
                whatsapp cadastrados e nós lhe enviaremos sua senha.
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            {alertMessage && (
                <div className="mb-4 font-medium text-sm text-red-600">
                    {alertMessage}
                </div>
            )}

            {password && userName ? (
                <div className="text-center">
                    <div className="mb-4 text-xl">
                        Olá {userName}, sua senha é {password}
                    </div>
                    <button onClick={resetForm} className="text-green-500">
                        <p className="bg-custom-green text-white text-12px p-2 rounded-2xl">
                            Ok!
                        </p>
                    </button>
                </div>
            ) : (
                <form onSubmit={submit}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Email"
                    />

                    <InputError message={errors.email} className="mt-2" />

                    <TextInput
                        id="whatsapp"
                        type="text"
                        name="whatsapp"
                        value={data.whatsapp}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("whatsapp", e.target.value)}
                        placeholder="Whatsapp"
                    />

                    <InputError message={errors.whatsapp} className="mt-2" />

                    <div className="flex items-center justify-center mt-2">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            Receber Senha
                        </PrimaryButton>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href={route("login")}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Voltar para Login
                        </Link>
                    </div>
                </form>
            )}
        </GuestLayout>
    );
}
