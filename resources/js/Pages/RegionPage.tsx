import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "../types";
import RegionUsers from "../Components/RegionUsers";

interface Props extends PageProps {
    bairro: string;
}

export default function RegionPage({ auth, bairro }: Props) {
    const authId = auth.user.id;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Região" />
            <div className="h-auto w-full flex flex-wrap sm:px-5 pb-5">
                <RegionUsers authId={authId} bairro={bairro} />
            </div>
        </AuthenticatedLayout>
    );
}
