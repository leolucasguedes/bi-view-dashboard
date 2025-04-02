import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import RankingComponent from "../Components/RankingComponent";
import AreaComponent from "../Components/AreaComponent";
import { PageProps } from "../types";

export default function Ranking({ auth }: PageProps) {
    const userADM = auth.user.is_admin;
    const authId = auth.user.id;
    const is_admin = userADM === 1 ? true : false;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-18px sm:text-22px ml-5 lg:ml-60 pt-5 sm:mt-1 font-medium leading-30px text-gray-700 dark:text-white font-poppins">
                    Rankings
                </h2>
            }
        >
            <Head title="Ranking" />
            <div className="h-auto w-full flex flex-wrap sm:px-5 pb-5">
                <RankingComponent adm={is_admin} authId={authId} />

                <AreaComponent authId={authId} />
            </div>
        </AuthenticatedLayout>
    );
}
