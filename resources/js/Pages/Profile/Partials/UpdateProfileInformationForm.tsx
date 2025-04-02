import InputError from "../../../Components/InputError";
import InputLabel from "../../../Components/InputLabel";
import PrimaryButton from "../../../Components/PrimaryButton";
import TextInput from "../../../Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { FormEventHandler } from "react";
import { PageProps } from "../../../types";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            bairro: user.bairro,
            nascimento: user.nascimento,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("perfil.update"));
    };

    const translateErrorMessage = (
        message: string | string[] | undefined
    ): string | undefined => {
        if (Array.isArray(message)) {
            return message
                .map((msg) => {
                    switch (msg) {
                        case "The nascimento field format is invalid.":
                            return "Para atualizar o nascimento digite somente números na ordem DIA/MÊS/ANO";
                        case "The email has already been taken.":
                            return "O email já está em uso.";
                        default:
                            return msg;
                    }
                })
                .join(", ");
        } else if (typeof message === "string") {
            switch (message) {
                case "The nascimento field format is invalid.":
                    return "Para atualizar o nascimento digite somente números na ordem DIA/MÊS/ANO";
                case "The email has already been taken.":
                    return "O email já está em uso.";
                default:
                    return message;
            }
        }
        return message;
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Informações do perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-white">
                    Atualize as informações do perfil da sua conta e o endereço
                    de e-mail
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nome"
                        className="dark:text-white"
                    />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full dark:bg-light-dark dark:text-white"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="dark:text-white"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full dark:bg-light-dark dark:text-white"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError
                        className="mt-2"
                        message={translateErrorMessage(errors.email)}
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="bairro"
                        value="Bairro"
                        className="dark:text-white"
                    />

                    <TextInput
                        id="bairro"
                        className="mt-1 block w-full dark:bg-light-dark dark:text-white"
                        value={data.bairro}
                        onChange={(e) => setData("bairro", e.target.value)}
                        required
                        autoComplete="address-level2"
                    />

                    <InputError className="mt-2" message={errors.bairro} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="nascimento"
                        value="Data de Nascimento (Digite como DDMMAAAA - 01012000)"
                        className="dark:text-white"
                    />

                    <TextInput
                        id="nascimento"
                        className="mt-1 block w-full pt-3 dark:bg-light-dark dark:text-white"
                        placeholder="__/__/____"
                        value={data.nascimento}
                        onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(
                                /[^\d]/g,
                                ""
                            );
                            setData("nascimento", sanitizedValue);
                        }}
                        required
                        maxLength={8}
                        autoComplete="bday"
                    />

                    <InputError
                        className="mt-2"
                        message={translateErrorMessage(errors.nascimento)}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Seu endereço de e-mail não foi verificado.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Clique aqui para reenviar o e-mail de
                                verificação.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                Um novo link de verificação foi enviado para o
                                seu endereço de e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Salvar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Salvo.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
