import { useState, useContext } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { PageProps, UserProfile, UserDataFull } from "../types";
import { Link } from "@inertiajs/react";
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { impersonateContext } from "../api/ImpersonateContext";

interface UserLink extends UserProfile {
    referral_code: string;
}

interface Props extends PageProps {
    users: UserDataFull[];
    userDT: UserLink;
    rede: number;
    userName: string;
}

export default function UserPage({
    auth,
    users,
    userDT,
    rede,
    userName,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [editingField, setEditingField] = useState("");
    const { setPerson } = useContext(impersonateContext);
    const userADM = auth.user.is_admin;
    const is_admin = userADM === 1 ? true : false;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            bairro: userDT.bairro,
            cidade: userDT.cidade,
            zona_eleitoral: userDT.zona_eleitoral,
        });

    const toggleEditing = (field: string) => {
        setEditingField(field);
        setEditing(!editing);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("painel.update", userDT.id));
        setEditing(false);
    };

    function formatDate(dateString: any) {
        if (!dateString) return "";
        const year = dateString.substring(0, 4);
        const month = dateString.substring(5, 7);
        const day = dateString.substring(8, 10);
        return `${day}/${month}/${year}`;
    }

    const handleClick = () => {
        setPerson(true);
        localStorage.setItem("person", JSON.stringify(true));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Painel" />
            <div className="h-auto w-full flex flex-wrap sm:px-5 pb-56">
                <div className="w-full bg-white dark:bg-light-dark h-auto pb-10 shadow-sm flex flex-col mt-8 overflow-x-auto relative">
                    <div className="p-4 text-custom-gray2 text-14px dark:text-white font-poppins">
                        Detalhes do Usuário
                    </div>
                    {is_admin && (
                        <div className="flex gap-4 justify-end pr-5 absolute top-3 right-1">
                            <Link
                                className="py-1 px-2 text-12px hover:text-custom-blue-dark bg-blue-300 hover:bg-custom-blue rounded-lg"
                                href={route("impersonate", { id: userDT.id })}
                                onClick={handleClick}
                            >
                                Mudar para painel do Usuário
                            </Link>
                        </div>
                    )}
                    <div className="pl-4 md:pl-10 dark:text-white font-poppins">
                        <p>
                            <strong>Nome:</strong> {userDT.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {userDT.email}
                        </p>
                        <div className="flex gap-5">
                            <p>
                                <strong>WhatsApp:</strong> {userDT.whatsapp}
                            </p>
                            <a
                                href={`https://wa.me/${userDT.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp
                                    className="size-5"
                                    style={{ cursor: "pointer" }}
                                />
                            </a>
                        </div>
                        <p>
                            <strong>Idade:</strong> {userDT.idade}
                        </p>
                        <p>
                            <strong>Nascimento:</strong>{" "}
                            {formatDate(userDT.nascimento)}
                        </p>
                        <p>
                            <strong>Gênero:</strong> {userDT.sexo}
                        </p>
                        <div className="relative">
                            <strong>Bairro: </strong>
                            {editing && editingField === "bairro" ? (
                                <input
                                    className="w-72 border-b border-custom-gray2 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                                    type="text"
                                    value={data.bairro}
                                    onChange={(e) =>
                                        setData("bairro", e.target.value)
                                    }
                                />
                            ) : (
                                userDT.bairro
                            )}
                            {is_admin ? (
                                <CiEdit
                                    onClick={() => toggleEditing("bairro")}
                                    className={`absolute -left-4 top-1/2 transform -translate-y-1/2 mr-2 size-4 ${
                                        editing && editingField === "bairro"
                                            ? "hidden"
                                            : ""
                                    }`}
                                    style={{ cursor: "pointer" }}
                                />
                            ) : (
                                <></>
                            )}
                            {editing && editingField === "bairro" && (
                                <FaCheckCircle
                                    onClick={submit}
                                    className="absolute left-[305px] top-1/2 transform -translate-y-1/2 mr-2 size-5"
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </div>
                        <div className="relative">
                            <strong>Cidade: </strong>
                            {editing && editingField === "cidade" ? (
                                <input
                                    className="w-72 border-b border-custom-gray2 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                                    type="text"
                                    value={data.cidade}
                                    onChange={(e) =>
                                        setData("cidade", e.target.value)
                                    }
                                />
                            ) : (
                                userDT.cidade
                            )}
                            {is_admin ? (
                                <CiEdit
                                    onClick={() => toggleEditing("cidade")}
                                    className={`absolute -left-4 top-1/2 transform -translate-y-1/2 mr-2 size-4 ${
                                        editing && editingField === "cidade"
                                            ? "hidden"
                                            : ""
                                    }`}
                                    style={{ cursor: "pointer" }}
                                />
                            ) : (
                                <></>
                            )}
                            {editing && editingField === "cidade" && (
                                <FaCheckCircle
                                    onClick={submit}
                                    className="absolute left-[305px] top-1/2 transform -translate-y-1/2 mr-2 size-5"
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </div>
                        <div className="relative">
                            <strong>Bairro em que vota: </strong>
                            {editing && editingField === "zona_eleitoral" ? (
                                <input
                                    className="border-b border-custom-gray2 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                                    type="text"
                                    value={data.zona_eleitoral}
                                    onChange={(e) =>
                                        setData(
                                            "zona_eleitoral",
                                            e.target.value
                                        )
                                    }
                                />
                            ) : (
                                userDT.zona_eleitoral
                            )}
                            {is_admin ? (
                                <CiEdit
                                    onClick={() =>
                                        toggleEditing("zona_eleitoral")
                                    }
                                    className={`absolute -left-4 top-1/2 transform -translate-y-1/2 mr-2 size-4 ${
                                        editing &&
                                        editingField === "zona_eleitoral"
                                            ? "hidden"
                                            : ""
                                    }`}
                                    style={{ cursor: "pointer" }}
                                />
                            ) : (
                                <></>
                            )}
                            {editing && editingField === "zona_eleitoral" && (
                                <FaCheckCircle
                                    onClick={submit}
                                    className="absolute left-[305px] top-1/2 transform -translate-y-1/2 mr-2 size-5"
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </div>
                        <p>
                            <strong>Rede: </strong>
                            {rede}
                        </p>
                        <p>
                            <strong>Link: </strong>
                            https://api.whatsapp.com/send?phone=5521991992766&text=Fazer%20meu%20cadastro%20({userDT.referral_code})
                        </p>
                        {userName === null ? (
                            <></>
                        ) : (
                            <p>
                                <strong>Indicado por: </strong>
                                {userName}
                            </p>
                        )}
                    </div>
                    <div className="mt-8 px-5 md:px-10">
                        <h2 className="text-custom-gray2 text-14px font-semibold mb-4 dark:text-white font-poppins">
                            Indicações - {users?.length}
                        </h2>
                        <div className="w-full flex items-center justify-between font-poppins pl-4 py-2 mb-1">
                            <div
                                className="truncate font-bold dark:text-white mr-8 md:mr-0"
                                style={{ width: "110px" }}
                            >
                                Nome
                            </div>
                            <div
                                className="hidden x1:block font-bold pl-8 dark:text-white"
                                style={{ width: "200px" }}
                            >
                                Email
                            </div>
                            <div
                                className="truncate font-bold pl-6 dark:text-white"
                                style={{ width: "155px" }}
                            >
                                Bairro
                            </div>
                            <div
                                className="hidden sm:block font-bold pl-4 dark:text-white"
                                style={{ width: "120px" }}
                            >
                                Whatsapp
                            </div>
                            <div
                                className="hidden sm:block font-bold pl-4 dark:text-white"
                                style={{ width: "180px" }}
                            >
                                Maior Preocupação
                            </div>
                            <div
                                className="hidden sm:block font-bold pl-4 dark:text-white"
                                style={{ width: "70px" }}
                            >
                                Indicados
                            </div>
                            <div
                                className="truncate font-bold pl-4 dark:text-white"
                                style={{ width: "80px" }}
                            >
                                Rede
                            </div>
                        </div>
                        <ul>
                            {users?.map((user, index) => (
                                <Link key={index} href={`/painel/${user.id}`}>
                                    <li
                                        key={index}
                                        className={`w-full flex items-center justify-between font-poppins pl-4 py-2 mb-1 dark:border-2 dark:border-custom-gray2 rounded-xl ${
                                            index % 2 === 0
                                                ? "bg-list-gray dark:bg-light-dark dark:text-white"
                                                : "bg-white dark:bg-light-dark dark:text-white"
                                        }`}
                                        style={{ maxWidth: "100%" }}
                                    >
                                        <div
                                            className="truncate"
                                            style={{ width: "140px" }}
                                        >
                                            {user.name}
                                        </div>
                                        <div
                                            className="hidden x1:block truncate"
                                            style={{ width: "200px" }}
                                        >
                                            {user.email}
                                        </div>
                                        <div
                                            className="truncate"
                                            style={{ width: "150px" }}
                                        >
                                            {user.bairro}
                                        </div>
                                        <div
                                            className="hidden sm:block truncate"
                                            style={{ width: "130px" }}
                                        >
                                            {user.whatsapp}
                                        </div>
                                        <div
                                            className="hidden sm:block truncate"
                                            style={{ width: "70px" }}
                                        >
                                            {user.indications}
                                        </div>
                                        <div
                                            className="truncate"
                                            style={{ width: "50px" }}
                                        >
                                            {user.rede}
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
