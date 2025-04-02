import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, UserDataFull } from "../types";
import { SlPeople } from "react-icons/sl";
import { LiaCrownSolid } from "react-icons/lia";
import { IoPersonSharp } from "react-icons/io5";
import ContactModal from "../Components/ContactModal";
import { useUserContext } from "../api/UserContext";

export default function Contact({ auth }: PageProps) {
    const { users, loading, fetchUsers } = useUserContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<UserDataFull[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const authId = auth.user.id;
    const isAdmin = auth.user.is_admin === 1;

    useEffect(() => {
        fetchUsers(authId, isAdmin);
    }, [authId, isAdmin, fetchUsers]);

    const handleSearch = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.type === "keydown" &&
            (event as React.KeyboardEvent<HTMLInputElement>).key !== "Enter"
        ) {
            return;
        }

        const searchTerm = (event.target as HTMLInputElement).value;
        setSearchTerm(searchTerm);

        const results = users?.filter((user: any) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results.slice(0, 50));
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Contato" />
            <div className="h-auto w-full flex flex-wrap sm:px-5 pb-5">
                <div className="h-auto w-full mt-10 mb-5 flex gap-5 flex-wrap justify-center">
                    <ContactModal
                        users={users}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                    <div
                        className="flex justify-center items-center bg-custom-green h-[94px] w-[260px] shadow-sm cursor-pointer rounded-md lg:w-[382.5px]"
                        onClick={handleOpenModal}
                    >
                        <div className="p-8 text-18px text-white flex mx-2 font-thin relative font-poppins">
                            <SlPeople className="size-8 text-white mr-7" />
                            Novo Contato
                        </div>
                    </div>
                    <Link href="/ranking">
                        <div className="flex justify-center items-center bg-custom-cblue h-[94px] w-[260px] shadow-sm rounded-md lg:w-[382.5px]">
                            <div className="p-8 text-18px text-white flex mx-2 font-thin relative font-poppins">
                                <LiaCrownSolid className="size-8 text-white mr-6" />
                                Ranking
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="w-full bg-white dark:bg-light-dark rounded-lg h-auto pb-10 shadow-sm flex flex-col mt-2 mx-2 lg:px-8 overflow-x-auto">
                    <div className="p-4 text-custom-gray2 text-18px font-poppins mt-2 dark:text-white">
                        Consultar Contato
                    </div>
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyDown={handleSearch}
                            className="w-full h-[50px] my-2 mx-4 dark:bg-light-dark rounded-md border border-gray-200 focus:outline-none focus:ring-2 text-black font-poppins"
                            placeholder="INFORME O NOME DO CONTATO"
                            style={{
                                paddingLeft: "20px",
                                fontSize: "14px",
                            }}
                        />
                        {searchResults.length > 0 ? (
                            <ul className="w-full">
                                <div className="w-full flex items-center font-poppins gap-16 pl-12 py-2 mb-1 dark:text-white">
                                    <div
                                        className="truncate font-bold mr-4 md:mr-0"
                                        style={{ width: "150px" }}
                                    >
                                        Nome
                                    </div>
                                    <div
                                        className="truncate font-bold"
                                        style={{ width: "150px" }}
                                    >
                                        Bairro
                                    </div>
                                    <div
                                        className="hidden sm:block font-bold"
                                        style={{ width: "120px" }}
                                    >
                                        Whatsapp
                                    </div>
                                    <div
                                        className="hidden sm:block truncate font-bold"
                                        style={{ width: "80px" }}
                                    >
                                        Indicados
                                    </div>
                                    <div
                                        className="truncate font-bold"
                                        style={{ width: "80px" }}
                                    >
                                        Rede
                                    </div>
                                </div>
                                {searchResults.map(
                                    (user: UserDataFull, index: number) => (
                                        <Link
                                            href={`/painel/${user.id}`}
                                            key={index}
                                        >
                                            <li
                                                className={`w-full flex items-center font-poppins gap-16 pl-12 py-2 mb-1 relative dark:border-2 dark:border-custom-gray2 rounded-xl ${
                                                    index % 2 === 0
                                                        ? "bg-list-gray dark:bg-light-dark dark:text-white"
                                                        : "bg-white dark:bg-light-dark dark:text-white"
                                                }`}
                                                style={{ maxWidth: "100%" }}
                                            >
                                                <IoPersonSharp className="absolute top-3 left-4" />
                                                <div
                                                    className="truncate"
                                                    style={{ width: "150px" }}
                                                >
                                                    {user.name}
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
                                                    className="hidden sm:block truncate"
                                                    style={{ width: "80px" }}
                                                >
                                                    {user.indications}
                                                </div>
                                                <div
                                                    className="truncate"
                                                    style={{ width: "40px" }}
                                                >
                                                    {user.rede}
                                                </div>
                                            </li>
                                        </Link>
                                    )
                                )}
                            </ul>
                        ) : (
                            <p className="mt-10 pb-40 font-poppins dark:text-white">
                                Não há nenhum contato selecionado
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
