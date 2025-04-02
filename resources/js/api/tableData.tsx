import { TableColumn } from "react-data-table-component";
import { RankUserDataFull } from "../types";
import { FaEye, FaWhatsapp } from "react-icons/fa";
import { Link } from "@inertiajs/react";

interface RankDataPosition extends RankUserDataFull {
    position: number;
}

export const columns: TableColumn<RankDataPosition>[] = [
    {
        name: "Posição",
        selector: (row) => `${row.position}°`,
        width: "150px",
    },
    {
        name: "Nome",
        selector: (row) => row.name,
        width: "240px",
    },
    {
        name: "Bairro",
        selector: (row) => row.bairro,
        width: "240px",
    },
    {
        name: "Indicações",
        cell: (row) => row.indications,
        width: "140px",
    },
    {
        name: "Rede",
        cell: (row) => row.rede,
        width: "100px",
    },
    {
        name: "",
        cell: (row) => (
            <Link href={`/painel/${row.id}`}>
                <FaEye style={{ cursor: "pointer" }} />
            </Link>
        ),
        width: "25px",
    },
    {
        name: "",
        cell: (row) => (
            <a href={`https://wa.me/${row.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp style={{ cursor: "pointer" }} />
            </a>
        ),
        width: "25px",
    },
];

export const conditionalRowStyles: any[] = [
    {
        when: (position: any) => position % 2 === 0,
        style: {
            backgroundColor: "#404040",
        },
    },
    {
        when: (position: any) => position % 2 !== 0,
        style: {
            backgroundColor: "#ffffff",
        },
    },
];

export const mobileColumns: TableColumn<RankDataPosition>[] = [
    {
        name: "N°",
        selector: (row) => `${row.position}°`,
        width: "60px",
    },
    {
        name: "Nome",
        selector: (row) => row.name,
        width: "110px",
    },
    {
        name: "Indicações",
        cell: (row) => row.indications,
        width: "80px",
    },
    {
        name: "Rede",
        cell: (row) => row.rede,
        width: "70px",
    },
    {
        name: "",
        cell: (row) => (
            <Link href={`/painel/${row.id}`}>
                <FaEye style={{ cursor: "pointer" }} />
            </Link>
        ),
        width: "20px",
    },
    {
        name: "",
        cell: (row) => (
            <Link href={`https://wa.me/${row.whatsapp}`}>
                <FaWhatsapp style={{ cursor: "pointer" }} />
            </Link>
        ),
        width: "20px",
    },
];

export const customStyles = {
    rows: {
        style: {
            fontSize: "16px",
        },
    },
    headCells: {
        style: {
            fontSize: "18px",
            fontWeight: "bold",
        },
    },
    cells: {
        style: {
            paddingLeft: "20px",
        },
    },
};

export const mobileStyles = {
    rows: {
        style: {
            fontSize: "14px",
        },
    },
    headCells: {
        style: {
            fontSize: "16px",
            fontWeight: "bold",
        },
    },
    cells: {
        style: {
            paddingLeft: "16px",
        },
    },
};
