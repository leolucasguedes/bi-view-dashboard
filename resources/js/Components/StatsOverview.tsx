import { Link } from "@inertiajs/react";
import { LeaderIcon, LocalIcon, RegisterIcon } from "@/icon";
import { TbWorldSearch } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import { useState, useEffect } from "react";

interface StatsOverviewProps {
    id: number;
}

interface Data {
    total: number;
    leaders: number;
    rede: number;
    bairro: number;
}

export default function StatsOverview({ id }: StatsOverviewProps) {
    const [data, setData] = useState<Data>({
        total: 0,
        leaders: 0,
        rede: 0,
        bairro: 0,
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post(
                    "api/dashboard/stats-overview",
                    {
                        userId: id,
                    }
                );

                if (response.data.success) {
                    const newData = {
                        total: response.data.data.total,
                        leaders: response.data.data.leaders,
                        rede: response.data.data.rede,
                        bairro: response.data.data.bairro,
                    };

                    setData(newData);
                    localStorage.setItem(
                        "dashboardData",
                        JSON.stringify(newData)
                    );
                } else {
                    console.log("Usuário não encontrado");
                }
            } catch (error) {
                console.log(error);
            }
        };

        const storedData = localStorage.getItem("dashboardData");
        if (storedData) {
            setData(JSON.parse(storedData));
        }

        if (id) {
            getData();
        }
    }, [id]);

    return (
        <div className="h-auto w-full mt-3 flex flex-wrap justify-center gap-2 px-5 md:px-0">
            <Link
                className="bg-custom-blue dark:bg-light-dark h-[80px] w-full max-w-[300px] min-w-[250px] flex-1 shadow-sm rounded-md"
                href="/cadastrados"
            >
                <div className="p-3 flex mx-3 font-bold relative font-poppins">
                    <div className="text-white w-12 h-12 mr-3 mt-1 flex justify-center items-center">
                        <RegisterIcon />
                    </div>
                    <span className="text-14px text-white mt-0.5">
                        Total de Cadastros
                    </span>
                    <span className="text-22px absolute top-8 left-20 dark:text-white">
                        {data.total}
                    </span>
                </div>
            </Link>
            <Link
                className="bg-custom-yellow dark:bg-light-dark h-[80px] w-full max-w-[300px] min-w-[250px] flex-1 shadow-sm rounded-md"
                href="/ranking"
            >
                <div className="p-3 flex mx-3 font-bold relative font-poppins">
                    <div className="w-12 h-12 text-white pl-1 mr-3 mt-1.5 flex justify-center items-center">
                        <LeaderIcon />
                    </div>
                    <span className="text-14px text-white mt-0.5">
                        Lideranças
                    </span>
                    <span className="text-22px absolute top-8 left-20 dark:text-white">
                        {data.leaders}
                    </span>
                </div>
            </Link>
            <Link
                className="bg-custom-green dark:bg-light-dark h-[80px] w-full max-w-[300px] min-w-[250px] flex-1 shadow-sm rounded-md"
                href="/ranking"
            >
                <div className="p-3 flex mx-3 font-bold relative font-poppins">
                    <div className="w-12 h-12 text-white mr-5 mt-1 flex justify-center items-center">
                        <TbWorldSearch className="w-[36px] h-[38px]" />
                    </div>
                    <span className="text-14px text-white mt-0.5">
                        Minha Rede
                    </span>
                    <span className="text-22px absolute top-8 left-20 dark:text-white">
                        {data.rede}
                    </span>
                </div>
            </Link>
            <div className="bg-white  h-[80px] w-full max-w-[300px] min-w-[250px] flex-1 shadow-sm rounded-md">
                <div className="pl-8 pt-4 flex">
                    <div className="text-gray-500 flex">
                        <div className="mr-3 w-12 h-12 pl-1 flex justify-center items-center">
                            <LocalIcon />
                        </div>
                        <span className="text-12px text-black font-poppins mt-1">
                            <span className="font-bold">{data.bairro}</span>{" "}
                            contatos com local de votação informado
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
