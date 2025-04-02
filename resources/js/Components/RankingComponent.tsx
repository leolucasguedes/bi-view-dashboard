import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import {
    columns,
    mobileColumns,
    conditionalRowStyles,
    customStyles,
    mobileStyles,
} from "../api/tableData";
import { LeadListIcon } from "../icon";
import { RankUserDataFull } from "../types";
import ExportButton from "./ExportButton";
import { FaCrown } from "react-icons/fa";
import { useUserContext } from "../api/UserContext";

interface RankDataPosition extends RankUserDataFull {
    position: number;
}

interface Props {
    adm: boolean;
    authId: number;
}

function RankingComponent({ adm, authId }: Props) {
    const { users, loading, fetchUsers } = useUserContext();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [rankType, setRankType] = useState<"indications" | "rede">(
        "indications"
    );
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage: number = 10;
    const pageSize: number = 10;
    const isAdmin = adm;

    useEffect(() => {
        fetchUsers(authId, isAdmin);
    }, [authId, isAdmin, fetchUsers]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    function generateLeaderboard(
        rank: RankUserDataFull[],
        type: "indications" | "rede"
    ): RankDataPosition[] {
        const filteredRank = rank.filter((user) => user[type] > 0);

        const filteredAndSearchedRank = filteredRank.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sortedRank = filteredAndSearchedRank
            .slice()
            .sort((a, b) => b[type] - a[type]);

        const leaderboard = sortedRank.map((user, index) => ({
            ...user,
            position: index + 1,
        }));

        return leaderboard;
    }

    const rankSort = generateLeaderboard(users, rankType);
    const pageCount: number = Math.ceil(rankSort.length / itemsPerPage);
    const paginatedData = rankSort.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const handleRankTypeChange = (type: "indications" | "rede") => {
        setRankType(type);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="w-full overflow-x-auto mt-8 bg-white dark:bg-light-dark pb-12 rounded-xl md:text-left relative">
            <div className="flex absolute bottom-0 right-0">
                <p className="text-12px font-poppins pr-2 pt-0.5 dark:text-white">
                    Planilhas:
                </p>
                <ExportButton usersAll={rankSort} />
            </div>
            <div className="absolute top-8 left-6">
                <LeadListIcon />
            </div>
            <h1 className="text-18px dark:text-white font-bold font-poppins mb-7 md:mb-4 py-6 md:text-22px ml-20">
                Maiores Embaixadores
            </h1>
            <div className="absolute top-16 right-43 md:top-12 md:right-56">
                <input
                    type="text"
                    placeholder="Pesquisar por nome"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border border-gray-300 px-3 py-1 rounded-lg font-poppins text-14px dark:bg-light-dark"
                />
            </div>
            {currentPage === 0 &&
                paginatedData.length !== 0 &&
                searchTerm === "" && (
                    <>
                        <FaCrown className="absolute sm:flex top-[170px] sm:top-[165px] md:top-[161px] lg:top-[162px] left-10 sm:left-4 size-5 sm:size-7 text-yellow-500 z-20 rounded-lg p-1 dark:bg-light-dark" />
                        <FaCrown className="absolute sm:flex top-[218px] sm:top-[213px] md:top-[209px] lg:top-[210px] left-10 sm:left-4 size-5 sm:size-7 text-silver z-20 rounded-lg p-1 dark:bg-light-dark" />
                        <FaCrown className="absolute sm:flex top-[266px] sm:top-[262px] md:top-[255px] lg:top-[258px] left-10 sm:left-4 size-5 sm:size-7 text-bronze z-20 rounded-lg p-1 dark:bg-light-dark" />
                    </>
                )}
            <div className="absolute md:top-12 top-16 md:right-9 right-0.5 space-x-2">
                <button
                    className={`border border-gray-300 px-3 py-1 rounded-lg font-poppins text-14px ${
                        rankType === "indications"
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                    onClick={() => handleRankTypeChange("indications")}
                >
                    Indicações
                </button>
                <button
                    className={`border border-gray-300 px-3 py-1 rounded-lg font-poppins text-14px ${
                        rankType === "rede" ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => handleRankTypeChange("rede")}
                >
                    Rede
                </button>
            </div>
            <DataTable
                className="sm:px-10 bg-white dark:bg-light-dark"
                columns={isMobile ? mobileColumns : columns}
                data={paginatedData}
                conditionalRowStyles={conditionalRowStyles}
                customStyles={isMobile ? mobileStyles : customStyles}
                responsive
            />
            <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName="pagination flex justify-center mt-7"
                pageClassName="px-2"
                activeClassName="text-blue-600 font-bold"
                previousClassName="border border-gray-300 px-3 py-1 rounded-lg mr-2"
                nextClassName="border border-gray-300 px-3 py-1 rounded-lg ml-2"
                disabledClassName="opacity-50 cursor-not-allowed"
            />
        </div>
    );
}

export default RankingComponent;
