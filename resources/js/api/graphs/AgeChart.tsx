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

export const AgeChart: React.FC<Props> = ({ users }) => {
    const faixasEtarias = categorizarPorFaixaEtaria(users);

    const chartData = {
        labels: Object.keys(faixasEtarias),
        datasets: [
            {
                label: "Usuários",
                data: Object.values(faixasEtarias),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
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
                <span className="p-3 font-poppins font-bold text-16px dark:text-white">Faixa Etária</span>
                <Pie className="max-h-[150px] max-w-[150px]" data={chartData} options={options} />
            </div>
            <div className="bg-white dark:bg-light-dark rounded-lg py-7 h-[280px] w-[120px] flex flex-col items-center overflow-y-auto overflow-x-auto">
                <AgeLegend
                    labels={chartData.labels}
                    backgroundColors={chartData.datasets[0].backgroundColor}
                />
            </div>
        </div>
    );
};

const categorizarPorFaixaEtaria = (users: UserData[]) => {
    const faixasEtarias: { [key: string]: number } = {
        "18-30 anos": 0,
        "31-40 anos": 0,
        "41-50 anos": 0,
        "51-60 anos": 0,
        "60+": 0,
    };

    users.forEach((user) => {
        const idade = user.idade;
        if (idade >= 18 && idade <= 30) {
            faixasEtarias["18-30 anos"]++;
        } else if (idade >= 31 && idade <= 40) {
            faixasEtarias["31-40 anos"]++;
        } else if (idade >= 41 && idade <= 50) {
            faixasEtarias["41-50 anos"]++;
        } else if (idade >= 51 && idade <= 60) {
            faixasEtarias["51-60 anos"]++;
        } else {
            faixasEtarias["60+"]++;
        }
    });

    return faixasEtarias;
};

export const AgeLegend: React.FC<LegendProps> = ({
    labels,
    backgroundColors,
}) => {
    return (
        <div>
            <ul className="list-none">
                {labels.map((label, index) => (
                    <li key={label} className="flex items-center mx-2 mb-2 text-10px dark:text-white">
                        <span
                            className="w-3 h-3 mr-2 rounded-xl"
                            style={{ backgroundColor: backgroundColors[index] }}
                        ></span>
                        <span>{label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
