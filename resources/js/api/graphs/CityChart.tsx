import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { UserData } from "../../types";

Chart.register(ArcElement);

interface LegendProps {
    labels: string[];
    backgroundColors: string[];
}

interface Props {
    users: UserData[];
}

export const CityChart: React.FC<Props> = ({ users }) => {
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const filterUsers = users.filter(user => user.cidade !== null && user.cidade !== undefined);

    const cidadesNormalizadas = filterUsers.map((user) =>
        user.cidade?.toLowerCase().trim()
    );

    const contagemPorCidade: { [key: string]: number } = {};
    cidadesNormalizadas.forEach((cidade) => {
        contagemPorCidade[cidade] = (contagemPorCidade[cidade] || 0) + 1;
    });

    const cidadesOrdenadas = Object.keys(contagemPorCidade).sort(
        (cidadeA, cidadeB) => {
            return contagemPorCidade[cidadeB] - contagemPorCidade[cidadeA];
        }
    );

    const cidadesValidas = cidadesOrdenadas.slice(0, 5);
    const cidadesView = cidadesValidas.map(capitalizeFirstLetter);

    const chartData = {
        labels: cidadesView,
        datasets: [
            {
                label: "Usuários",
                data: cidadesValidas.map((cidade) => contagemPorCidade[cidade]),
                backgroundColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="flex justify-between w-[320px]">
            <div className="bg-white dark:bg-light-dark rounded-lg h-[280px] w-[200px] flex flex-col gap-6 pl-4">
                <div className="p-3 font-bold font-poppins text-16px dark:text-white">Top 5 Cidades</div>
                <Pie
                    className="max-h-[160px] max-w-[160px]"
                    data={chartData}
                    options={options}
                />
            </div>
            <div className="bg-white dark:bg-light-dark py-7 rounded-lg h-[280px] w-[140px] flex flex-col items-center overflow-y-auto overflow-x-auto">
                <CityLegend
                    labels={chartData.labels}
                    backgroundColors={chartData.datasets[0].backgroundColor}
                />
            </div>
        </div>
    );
};

export const CityLegend: React.FC<LegendProps> = ({
    labels,
    backgroundColors,
}) => {
    return (
        <div>
            <ul className="list-none">
                {labels.map((label, index) => (
                    <li
                        key={`${label}${index}`}
                        className="flex items-center ml-4 mr-1 mb-2 text-10px dark:text-white"
                    >
                        <span
                            className="w-3 h-3 mr-2 rounded-lg"
                            style={{ backgroundColor: backgroundColors[index] }}
                        ></span>
                        <span>{label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
