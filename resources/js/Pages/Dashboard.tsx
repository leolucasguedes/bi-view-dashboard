import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
    AreaChart,
    AgeChart,
    GenderChart,
    CityChart,
    WeeklyContactGraph,
    DistributionCityChart,
    DistributionBairroChart,
    IndicadosGrowthChart,
    RedeGrowthChart,
} from "../api/graphs";
import { PageProps } from "../types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RedePosition } from "../Components/RedePosition";
import StatsOverview from "../Components/StatsOverview";
import { useUserContext } from "../api/UserContext";

export default function Dashboard({ auth }: PageProps) {
    const { users, loading, fetchUsers } = useUserContext();
    const authId = auth.user.id;
    const isAdmin = auth.user.is_admin === 1;

    useEffect(() => {
        fetchUsers(authId, isAdmin);
    }, [authId, isAdmin, fetchUsers]);

    function formatName(text: string) {
        const position1 = text.indexOf(" ");
        if (position1 !== -1) {
            return text.substring(0, position1);
        } else {
            return text;
        }
    }

    const userName = formatName(auth.user.name);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="hidden md:block text-22px ml-5 lg:ml-[225px] mt-5 sm:mt-1 font-bold leading-30px text-gray-700 dark:text-white font-poppins">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="h-auto w-full sm:px-4 py-2">
                <div className="flex flex-col pl-5 py-5 md:py-0">
                    <p className="md:hidden text-22px font-semibold font-poppins dark:text-white">
                        Bem vindo {userName}
                    </p>
                    <div className="md:hidden">
                        <RedePosition id={authId} admin={isAdmin} />
                    </div>
                </div>
                <StatsOverview id={authId} />
                <div className="w-full max-w-[1360px] flex flex-wrap justify-center gap-7 pt-8 pb-6">
                    {users?.length ? (
                        <>
                            <GenderChart users={users} />
                            <AgeChart users={users} />
                            <AreaChart users={users} />
                            <CityChart users={users} />
                        </>
                    ) : (
                        <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                    )}
                </div>
                <div className="h-auto w-full flex flex-col md:flex-row gap-7 shadow-sm py-2">
                    {users?.length ? (
                        <>
                            <IndicadosGrowthChart
                                users={users}
                                userId={authId}
                            />
                            <RedeGrowthChart users={users} userId={authId} />
                        </>
                    ) : (
                        <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                    )}
                </div>
                <div className="h-auto w-full flex flex-wrap md:flex-nowrap shadow-sm gap-4 py-2 mt-4">
                    <div className="w-full h-auto flex flex-col bg-white dark:bg-light-dark p-4 pl-4 gap-3 text-custom-gray2 dark:text-white text-14px">
                        Distribuição de Contatos por Cidade
                        {users?.length ? (
                            <DistributionCityChart users={users} />
                        ) : (
                            <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                        )}
                    </div>
                    <div className="w-full h-auto flex flex-col bg-white dark:bg-light-dark p-4 pl-4 gap-3 text-custom-gray2 dark:text-white text-14px">
                        Distribuição de Contatos por Bairro
                        {users?.length ? (
                            <DistributionBairroChart users={users} />
                        ) : (
                            <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                        )}
                    </div>
                </div>

                <div className="h-auto w-full flex flex-col justify-between bg-white dark:bg-light-dark shadow-sm py-2 mt-[15px]">
                    <div className="p-4 pl-7 text-custom-gray2 dark:text-white text-14px">
                        Evolução Semanal dos Contatos
                    </div>
                    {users?.length ? (
                        <WeeklyContactGraph users={users} />
                    ) : (
                        <AiOutlineLoading3Quarters className="text-6xl text-custom-blue animate-spin" />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
