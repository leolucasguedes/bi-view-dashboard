import { useState, useEffect } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    AreaChart,
    AgeChart,
    GenderChart,
    CityChart,
} from "../api/graphs";
import { Link } from "@inertiajs/react";
import { UserDataFull, PageProps } from "../types";
import { IoPersonSharp } from "react-icons/io5";
import ExportButton from "../Components/ExportButton";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Select from "react-select";
import { useUserContext } from "../api/UserContext";

export default function Filter({ auth }: PageProps) {
    const [filters, setFilters] = useState({
        idade: "",
        sexo: "",
        bairro: "",
        cidade: ""
    });

    const { users, loading, fetchUsers } = useUserContext();
    const [bairros, setBairros] = useState<string[]>([]);
    const [cidades, setCidades] = useState<string[]>([]);
    const authId = auth.user.id;
    const isAdmin = auth.user.is_admin === 1;

    useEffect(() => {
        fetchUsers(authId, isAdmin);
    }, [authId, isAdmin, fetchUsers]);

    useEffect(() => {
        if (users.length > 0) {
            setBairros(getRegion(users));
            setCidades(getCity(users));
        }
    }, [users]);

    function getRegion(users: UserDataFull[]): string[] {
        let region: { [key: string]: boolean } = {};

        users.forEach((user: UserDataFull) => {
            if (typeof user.bairro === "string" && user.bairro.trim() !== "") {
                const bairroTrue = user.bairro.toLowerCase().trim();
                region[bairroTrue] = true;
            }
        });

        return Object.keys(region).slice(0, 100);
    }

    function getCity(users: UserDataFull[]): string[] {
        let region: { [key: string]: boolean } = {};

        users.forEach((user: UserDataFull) => {
            if (typeof user.cidade === "string" && user.cidade.trim() !== "") {
                const cidadeTrue = user.cidade.toLowerCase().trim();
                region[cidadeTrue] = true;
            }
        });

        return Object.keys(region).slice(0, 100);
    }

    const ageRanges = [
        "18-30 anos",
        "31-40 anos",
        "41-50 anos",
        "51-60 anos",
        "60+",
    ];

    const [filteredUsers, setFilteredUsers] = useState<UserDataFull[]>([]);

    const applyFilters = (users: UserDataFull[]) => {
        const filtered = users.filter((user) => {
            const idadeMatch =
                !filters.idade ||
                (filters.idade.includes("+") &&
                    user.idade >= parseInt(filters.idade)) ||
                (filters.idade.includes("-") &&
                    user.idade >= parseInt(filters.idade.split("-")[0]) &&
                    user.idade <= parseInt(filters.idade.split("-")[1]));
            const sexoMatch = !filters.sexo || user.sexo === filters.sexo;
            const bairroMatch =
                !filters.bairro ||
                user.bairro?.toLowerCase().trim() === filters.bairro;
            const cidadeMatch =
                !filters.cidade ||
                user.cidade?.toLowerCase().trim() === filters.cidade;

            return (
                idadeMatch &&
                sexoMatch &&
                bairroMatch &&
                cidadeMatch
            );
        });

        setFilteredUsers(filtered);
    };

    const isEven = (index: number) => index % 2 === 0;

    const handleSelectChange = (selectedOption: any, field: string) => {
        setFilters({
            ...filters,
            [field]: selectedOption ? selectedOption.value : "",
        });
    };

    const bairroOptions = bairros.map((bairro) => ({
        value: bairro,
        label: bairro.charAt(0).toUpperCase() + bairro.slice(1),
    }));

    const cidadeOptions = cidades.map((cidade) => ({
        value: cidade,
        label: cidade.charAt(0).toUpperCase() + cidade.slice(1),
    }));

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Filtro" />

            <div className="h-auto w-full flex flex-col sm:px-5 pb-5">
                <div className="w-auto mt-4">
                    <div className="bg-white dark:bg-light-dark h-auto w-full px-2 flex flex-col md:flex-row flex-wrap pt-3 pb-14 gap-2 font-poppins rounded-2xl relative">
                        <span className="pt-3 pl-5 text-custom-gray2 font-bold text-16px dark:text-white">
                            Filtrar por:
                        </span>
                        <div className="flex ml-2 justify-between pb-1.5 border border-gray-400 rounded-lg">
                            <span className="text-custom-gray2 pt-2.5 pl-3 text-16px dark:text-white">
                                Idade:
                            </span>
                            <Select
                                className="max-w-[200px] min-w-[135px] flex-1 w-full h-[40px] pt-1 rounded-lg mx-1.5 border-none dark:bg-light-dark"
                                options={[
                                    { value: "", label: "Todas" },
                                    ...ageRanges.map((range) => ({
                                        value: range,
                                        label: range,
                                    })),
                                ]}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, "idade")
                                }
                                placeholder="Todas"
                            />
                        </div>
                        <div className="flex ml-2 justify-between pb-1.5 border border-gray-400 rounded-lg">
                            <span className="text-custom-gray2 pt-2.5 pl-3 text-16px dark:text-white">
                                Sexo:
                            </span>
                            <Select
                                className="w-full max-w-[200px] min-w-[135px] flex-1 h-[40px] pt-1 rounded-lg mx-1.5 mr-1 border-none dark:bg-light-dark"
                                options={[
                                    { value: "", label: "Todos" },
                                    { value: "Masculino", label: "Masculino" },
                                    { value: "Feminino", label: "Feminino" },
                                    { value: "Outros", label: "Outros" },
                                ]}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, "sexo")
                                }
                                placeholder="Todos"
                            />
                        </div>
                        <div className="flex ml-2 justify-between pb-1.5 border border-gray-400 rounded-lg">
                            <span className="text-custom-gray2 pt-2.5 pl-3 text-16px dark:text-white">
                                Bairro:
                            </span>
                            <Select
                                className="w-full max-w-[200px] min-w-[162px] flex-1 h-[40px] pt-1 rounded-lg mx-1.5 border-none dark:bg-light-dark"
                                options={[
                                    { value: "", label: "Todos" },
                                    ...bairroOptions,
                                ]}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, "bairro")
                                }
                                isClearable
                                placeholder="Todos"
                            />
                        </div>
                        <div className="flex ml-2 justify-between pb-1.5 border border-gray-400 rounded-lg">
                            <span className="text-custom-gray2 pt-2.5 pl-3 text-16px dark:text-white">
                                Cidade:
                            </span>
                            <Select
                                className="w-full max-w-[200px] min-w-[135px] flex-1 h-[40px] pt-1 rounded-lg mx-1.5 border-none dark:bg-light-dark"
                                options={[
                                    { value: "", label: "Todos" },
                                    ...cidadeOptions,
                                ]}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, "cidade")
                                }
                                isClearable
                                placeholder="Todas"
                            />
                        </div>
                        <div className="pl-24 md:pl-5 mt-1 absolute bottom-2 right-2">
                            <button
                                className="h-[40px] w-[171px] text-16px font-poppins font-bold bg-custom-green text-white rounded-lg"
                                onClick={() => applyFilters(users)}
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[1360px] flex flex-wrap justify-center gap-6 pt-5 md:pl-2">
                    {users?.length ? (
                        <>
                            <GenderChart
                                users={
                                    filteredUsers.length === 0
                                        ? users
                                        : filteredUsers
                                }
                            />
                            <AgeChart
                                users={
                                    filteredUsers.length === 0
                                        ? users
                                        : filteredUsers
                                }
                            />
                            <AreaChart
                                users={
                                    filteredUsers.length === 0
                                        ? users
                                        : filteredUsers
                                }
                            />
                            <CityChart
                                users={
                                    filteredUsers.length === 0
                                        ? users
                                        : filteredUsers
                                }
                            />
                        </>
                    ) : (
                        <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                    )}
                </div>
                <div className="w-full text-center md:text-left mt-8 bg-white dark:bg-light-dark lg:px-6 pb-10 rounded-xl">
                    <h1 className="text-22px mx-8 font-bold mb-4 py-6 font-poppins dark:text-white">
                        Resultados - {filteredUsers.length}
                    </h1>
                    {isAdmin ? (
                        <ExportButton usersAll={filteredUsers} />
                    ) : (
                        <></>
                    )}
                    <div className="w-full flex md:justify-between items-center font-poppins dark:text-white pl-11 pr-5 py-2 mb-1">
                        <div
                            className="truncate font-bold mr-20 md:mr-0"
                            style={{ width: "90px" }}
                        >
                            Nome
                        </div>
                        <div
                            className="hidden sm:block font-bold"
                            style={{ width: "40px" }}
                        >
                            Idade
                        </div>
                        <div
                            className="truncate font-bold"
                            style={{ width: "140px" }}
                        >
                            Bairro
                        </div>
                        <div
                            className="hidden sm:block font-bold"
                            style={{ width: "70px" }}
                        >
                            Indicados
                        </div>
                        <div
                            className="hidden sm:block font-bold"
                            style={{ width: "80px" }}
                        >
                            Rede
                        </div>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <p className="ml-12 mt-8 font-poppins dark:text-white">
                            Nenhum usuário encontrado
                        </p>
                    ) : (
                        filteredUsers.map(
                            (user: UserDataFull, index: number) => (
                                <li
                                    key={index}
                                    className={`relative w-full flex justify-between items-center font-poppins pl-12 pr-4 py-2 mb-1 rounded-xl dark:border-2 dark:border-custom-gray2 ${
                                        isEven(index)
                                            ? "bg-list-gray dark:bg-light-dark dark:text-white"
                                            : "bg-white dark:bg-light-dark dark:text-white"
                                    }`}
                                    style={{ maxWidth: "100%" }}
                                >
                                    <Link
                                        className="w-full h-full flex justify-between items-center"
                                        href={`/painel/${user.id}`}
                                    >
                                        <IoPersonSharp className="absolute top-3 left-4" />
                                        <div
                                            className="truncate font-bold"
                                            style={{ width: "125px" }}
                                        >
                                            {user.name}
                                        </div>
                                        <div
                                            className="hidden sm:block truncate"
                                            style={{ width: "75px" }}
                                        >
                                            {user.idade}
                                        </div>
                                        <div
                                            className="truncate"
                                            style={{ width: "175px" }}
                                        >
                                            {user.bairro}
                                        </div>
                                        <div
                                            className="hidden sm:block truncate"
                                            style={{ width: "110px" }}
                                        >
                                            {user.indications}
                                        </div>
                                        <div
                                            className="hidden sm:block truncate"
                                            style={{ width: "70px" }}
                                        >
                                            {user.rede}
                                        </div>
                                    </Link>
                                    <a
                                        href={`https://wa.me/${user.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-3 right-4"
                                        style={{ zIndex: 10 }}
                                    >
                                        <FaWhatsapp />
                                    </a>
                                </li>
                            )
                        )
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
