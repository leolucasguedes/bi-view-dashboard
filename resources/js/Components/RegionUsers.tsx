import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { UserDataFull } from "../types";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
    authId: number;
    bairro: string;
}

export default function RegionUsers({ authId, bairro }: Props) {
    const [usersRegion, setUsersRegion] = useState<UserDataFull[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post("/bairro/region", {
                    userId: authId,
                    bairro: bairro,
                });

                if (response.data.success) {
                    setUsersRegion(response.data.data.users);
                } else {
                    console.log("Usuário não encontrado");
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (authId) {
            getData();
        }
    }, [authId, bairro]);
    return (
        <div className="w-full bg-white dark:bg-light-dark h-auto pb-10 shadow-sm flex flex-col mt-8 px-4 lg:px-8 overflow-x-auto rounded-xl">
            <div className="p-4 text-custom-gray2 text-14px dark:text-white font-poppins">
                Total de usuários {bairro}: {usersRegion?.length}
            </div>
            <div>
                <div className="w-full flex items-center font-poppins gap-16 pl-12 py-2 mb-1 dark:text-white">
                    <div
                        className="truncate font-bold"
                        style={{ width: "145px" }}
                    >
                        Nome
                    </div>
                    <div
                        className="hidden sm:block font-bold"
                        style={{ width: "35px" }}
                    >
                        Idade
                    </div>
                    <div
                        className="hidden md:block font-bold"
                        style={{ width: "80px" }}
                    >
                        Sexo
                    </div>
                    <div
                        className="hidden md:block font-bold pl-1"
                        style={{ width: "110px" }}
                    >
                        Whatsapp
                    </div>
                    <div
                        className="truncate font-bold"
                        style={{ width: "90px" }}
                    >
                        Indicações
                    </div>
                    <div
                        className="truncate font-bold"
                        style={{ width: "80px" }}
                    >
                        Rede
                    </div>
                </div>
                {usersRegion?.length ? (
                    <ul className="w-full">
                        {usersRegion.map(
                            (user: UserDataFull, index: number) => (
                                <Link href={`/painel/${user.id}`} key={index}>
                                    <li
                                        className={`flex items-center font-poppins gap-16 pl-12 py-2 mb-1 relative dark:border-2 dark:border-custom-gray2 rounded-xl ${
                                            index % 2 === 0
                                                ? "bg-list-gray dark:bg-light-dark dark:text-white"
                                                : "bg-white dark:bg-light-dark dark:text-white"
                                        }`}
                                        style={{ maxWidth: "100%" }}
                                    >
                                        <IoPersonSharp className="absolute top-3 left-4 dark:text-white" />
                                        <div
                                            className="truncate"
                                            style={{ width: "150px" }}
                                        >
                                            {user.name}
                                        </div>
                                        <div
                                            className="hidden sm:block truncate"
                                            style={{ width: "30px" }}
                                        >
                                            {user.idade}
                                        </div>
                                        <div
                                            className="hidden md:block truncate"
                                            style={{ width: "80px" }}
                                        >
                                            {user.sexo}
                                        </div>
                                        <div
                                            className="hidden md:block truncate"
                                            style={{ width: "120px" }}
                                        >
                                            {user.whatsapp}
                                        </div>
                                        <div
                                            className="truncate"
                                            style={{ width: "85px" }}
                                        >
                                            {user.indications}
                                        </div>
                                        <div
                                            className="truncate"
                                            style={{ width: "70px" }}
                                        >
                                            {user.rede}
                                        </div>
                                    </li>
                                </Link>
                            )
                        )}
                    </ul>
                ) : (
                    <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                )}
            </div>
        </div>
    );
}
