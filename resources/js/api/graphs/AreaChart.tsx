import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { UserData } from "../../types";
import { Link } from "@inertiajs/react";

Chart.register(ArcElement);

interface LegendProps {
    labels: string[];
    backgroundColors: string[];
}

interface Props {
    users: UserData[];
}

export const AreaChart: React.FC<Props> = ({ users }) => {
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const filterUsers = users.filter(user => user.bairro !== null && user.bairro !== undefined);

    const bairrosNormalizados = filterUsers.map((user) =>
        user.bairro?.toLowerCase().trim()
    );

    const contagemPorBairro: { [key: string]: number } = {};
    bairrosNormalizados.forEach((bairro) => {
        contagemPorBairro[bairro] = (contagemPorBairro[bairro] || 0) + 1;
    });

    const bairrosOrdenados = Object.keys(contagemPorBairro).sort(
        (bairroA, bairroB) => {
            return contagemPorBairro[bairroB] - contagemPorBairro[bairroA];
        }
    );

    const bairrosValidos = bairrosOrdenados.slice(0, 5);
    const bairrosView = bairrosValidos.map(capitalizeFirstLetter);

    const chartData = {
        labels: bairrosView,
        datasets: [
            {
                label: "Usuários",
                data: bairrosValidos.map((bairro) => contagemPorBairro[bairro]),
                backgroundColor: [
                    "rgba(255, 159, 64, 1)",
                    "rgba(255, 51, 153, 1)",
                    "rgba(0, 204, 102, 1)",
                    "rgba(255, 204, 0, 1)",
                    "rgba(0, 153, 204, 1)",
                ],
                borderColor: [
                    "rgba(255, 159, 64, 1)",
                    "rgba(255, 51, 153, 0.5)",
                    "rgba(0, 204, 102, 0.5)",
                    "rgba(255, 204, 0, 0.5)",
                    "rgba(0, 153, 204, 0.5)",
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
            <div className="bg-white dark:bg-light-dark rounded-lg h-[280px] w-[200px] flex flex-col pl-4 gap-6">
                <div className="p-3 font-bold font-poppins text-16px dark:text-white">Top 5 Bairros</div>
                <Pie
                    className="max-h-[150px] max-w-[150px]"
                    data={chartData}
                    options={options}
                />
            </div>
            <div className="bg-white dark:bg-light-dark rounded-lg h-[280px] w-[140px] py-7 flex flex-col items-center overflow-y-auto overflow-x-auto">
                <AreaLegend
                    labels={chartData.labels}
                    backgroundColors={chartData.datasets[0].backgroundColor}
                />
            </div>
        </div>
    );
};

export const AreaLegend: React.FC<LegendProps> = ({
    labels,
    backgroundColors,
}) => {
    return (
        <div>
            <ul className="list-none">
                {labels.map((label, index) => (
                    <Link href={`/bairro/${label}`} key={label}>
                        <li className="flex items-center ml-4 mr-1 mb-2 text-10px dark:text-white">
                            <span
                                className="w-3 h-3 mr-2 rounded-lg"
                                style={{
                                    backgroundColor: backgroundColors[index],
                                }}
                            ></span>
                            <span>{label}</span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};
