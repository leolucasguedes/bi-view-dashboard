import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { UserDataFull } from "../types";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ExportButton from "../Components/ExportButton";

interface Props {
    authId: number;
}

export default function UsersList({ authId }: Props) {
    const [users, setUsers] = useState<UserDataFull[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [viewAll, setViewAll] = useState(false);
    const [userslv1, setUserslv1] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await axios.post("/api/rede-total", {
                    userId: authId,
                    page: page,
                });

                if (response.data.success) {
                    setUsers((prevUsers) => [
                        ...prevUsers,
                        ...response.data.data.users,
                    ]);
                } else {
                    console.log("Usuário não encontrado");
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        if (authId && !viewAll && !userslv1) {
            getData();
        }
    }, [authId, page, viewAll, userslv1]);

    const handleScroll = () => {
        if (viewAll || userslv1) return;
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
            loading
        )
            return;

        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, viewAll, userslv1]);

    const handleViewAll = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/rede-total-all", {
                userId: authId,
            });

            if (response.data.success) {
                setUsers(response.data.data.users);
                setViewAll(true);
                setUserslv1(false);
                setPage(1);
            } else {
                console.log("Usuário não encontrado");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleIndications = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/rede-indicados", {
                userId: authId,
            });

            if (response.data.success) {
                setUsers(response.data.data.users);
                setUserslv1(true);
                setViewAll(false);
                setPage(1);
            } else {
                console.log("Usuário não encontrado");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (viewAll) {
            handleViewAll();
        }
        if (userslv1) {
            handleIndications();
        }
    }, [viewAll, userslv1]);

    return (
        <div className="w-full bg-white dark:bg-light-dark h-auto shadow-sm flex flex-col mt-8 overflow-x-auto rounded-xl">
            <div className="flex justify-between p-4 text-custom-gray2 text-14px font-poppins dark:text-white">
                {userslv1 === true ? (
                    <p className="mr-10 md:mr-0">Indicados - {users?.length}</p>
                ) : (
                    <p className="mr-10 md:mr-0">Rede Total - {users?.length}</p>
                )}
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={userslv1}
                        onChange={() => {
                            setUserslv1(true);
                            setViewAll(false);
                        }}
                        className="ml-2"
                        disabled={userslv1}
                    />
                    <label className="text-custom-gray2 text-14px font-poppins ml-2 dark:text-white">
                        Ver somente indicados
                    </label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={viewAll}
                        onChange={() => {
                            setViewAll(true);
                            setUserslv1(false);
                        }}
                        className="ml-2"
                        disabled={viewAll}
                    />
                    <label className="text-custom-gray2 text-14px font-poppins ml-2 dark:text-white">
                        Ver todos
                    </label>
                </div>
            </div>
            <div>
                <ExportButton usersAll={users} />
            </div>
            <div className="mt-8 px-10 pb-28">
                <div className="w-full flex items-center justify-between font-poppins pl-4 py-2 mb-1 bg-white dark:bg-light-dark rounded-xl">
                    <div
                        className="truncate font-bold dark:text-white"
                        style={{ width: "190px" }}
                    >
                        Nome
                    </div>
                    <div
                        className="hidden sm:block font-bold dark:text-white"
                        style={{ width: "35px" }}
                    >
                        Idade
                    </div>
                    <div
                        className="hidden md:block font-bold pl-2 dark:text-white"
                        style={{ width: "80px" }}
                    >
                        Sexo
                    </div>
                    <div
                        className="hidden x1:block font-bold pl-2 dark:text-white"
                        style={{ width: "200px" }}
                    >
                        Email
                    </div>
                    <div
                        className="truncate font-bold sm:pl-2 dark:text-white"
                        style={{ width: "140px" }}
                    >
                        Bairro
                    </div>
                    <div
                        className="hidden sm:block font-bold pl-2 dark:text-white"
                        style={{ width: "120px" }}
                    >
                        Whatsapp
                    </div>
                    <div
                        className="truncate font-bold dark:text-white"
                        style={{ width: "100px" }}
                    >
                        Indicações
                    </div>
                    <div
                        className="truncate font-bold dark:text-white"
                        style={{ width: "70px" }}
                    >
                        Rede
                    </div>
                </div>
                <ul>
                    {users?.map((user, index) => (
                        <li key={index}>
                            <Link href={`/painel/${user.id}`}>
                                <div
                                    key={index}
                                    className={`w-full flex items-center justify-between font-poppins pl-4 py-2 mb-1 dark:border-2 dark:border-custom-gray2 rounded-xl relative ${
                                        index % 2 === 0
                                            ? "bg-list-gray dark:bg-light-dark dark:text-white"
                                            : "bg-white dark:bg-light-dark dark:text-white"
                                    }`}
                                    style={{ maxWidth: "100%" }}
                                >
                                    <IoPersonSharp className="absolute top-3 -left-6 dark:text-white" />
                                    <div
                                        className="truncate"
                                        style={{ width: "200px" }}
                                    >
                                        {user.name}
                                    </div>
                                    <div
                                        className="hidden sm:block truncate"
                                        style={{ width: "40px" }}
                                    >
                                        {user.idade}
                                    </div>
                                    <div
                                        className="hidden md:block truncate"
                                        style={{ width: "85px" }}
                                    >
                                        {user.sexo}
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
                                        style={{ width: "120px" }}
                                    >
                                        {user.whatsapp}
                                    </div>
                                    <div
                                        className="truncate"
                                        style={{ width: "100px" }}
                                    >
                                        {user.indications}
                                    </div>
                                    <div
                                        className="truncate"
                                        style={{ width: "70px" }}
                                    >
                                        {user.rede}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                {loading && (
                    <AiOutlineLoading3Quarters className="animate-spin mx-auto my-4" />
                )}
            </div>
        </div>
    );
}
