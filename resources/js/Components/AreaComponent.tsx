import { Link } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { WorldIcon } from "../icon";
import { Count } from "../types";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

interface Props {
    authId: number;
}

function AreaComponent({ authId }: Props): JSX.Element {
    const [bairros, setBairros] = useState<Count[]>([]);
    const limitedBairros = bairros?.slice(0, 15);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post("api/count-area", {
                    userId: authId,
                });

                if (response.data.success) {
                    setBairros(response.data.data.bairros);
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
    }, [authId]);

    return (
        <div className="w-full text-left mt-8 bg-white dark:bg-light-dark pb-10 rounded-xl relative">
            <div className="flex justify-center absolute top-6 left-8">
                <WorldIcon />
            </div>
            <h1 className="text-18px mx-20 font-normal mb-4 py-6 sm:text-22px font-poppins dark:text-white">
                Bairros mais cadastrados
            </h1>
            <div className="flex justify-between px-6 sm:ml-8 mb-2 sm:mr-10 md:mr-40">
                <p className="py-2 ml-1 font-bold font-poppins dark:text-white">
                    Bairros
                </p>
                <p className="py-2 font-bold font-poppins dark:text-white">
                    Cadastros
                </p>
            </div>
            <div className="overflow-x-auto h-auto sm:mx-7">
                <ul className="mb-4 px-2 sm:px-4">
                    {limitedBairros.map((item: Count, index: number) => (
                        <div
                            key={index}
                            className={`flex justify-between ${
                                index % 2 === 0
                                    ? "bg-list-gray dark:bg-light-dark"
                                    : "bg-white dark:bg-light-dark"
                            }`}
                        >
                            <li className="py-2 pl-4 dark:text-white">
                                {item.name}
                            </li>
                            <div className="flex">
                                <li className="py-2 mr-7 md:mr-32 dark:text-white">
                                    {item.count}
                                </li>
                                <Link href={`/bairro/${item.name}`}>
                                    <MagnifyingGlassIcon className="size-4 mt-3 mr-6 text-custom-green" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AreaComponent;
