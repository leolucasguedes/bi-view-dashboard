import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "../types";
import UsersList from "../Components/UserList";

export default function Users({ auth }: PageProps) {
    const authId = auth.user.id;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Rede" />
            <div className="h-auto w-full flex flex-wrap sm:px-5 pb-5">
                <UsersList authId={authId} />
            </div>
        </AuthenticatedLayout>
    );
}
