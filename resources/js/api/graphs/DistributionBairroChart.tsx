import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { ChartData } from "chart.js";
import { UserData } from "../../types";

Chart.register(ArcElement);

interface DistributionBairroChartProps {
    users: UserData[];
}

export const DistributionBairroChart: React.FC<DistributionBairroChartProps> = ({
    users,
}) => {
    const bairroCounts: { [key: string]: number } = users.reduce((acc, user) => {
        if (user.bairro) {
            acc[user.bairro] = (acc[user.bairro] || 0) + 1;
        }
        return acc;
    }, {} as { [key: string]: number });

    const sortedCities = Object.keys(bairroCounts).sort(
        (a, b) => bairroCounts[b] - bairroCounts[a]
    );

    const topCities = sortedCities.slice(0, 5);
    const counts = topCities.map(bairro => bairroCounts[bairro]);

    const data: ChartData<"bar", number[], unknown> = {
        labels: topCities,
        datasets: [
            {
                label: "Número de usuários por município",
                backgroundColor: "rgba(23, 125, 255, 1)",
                borderColor: "rgba(23, 125, 255, 0.5)",
                borderWidth: 1,
                data: counts,
            },
        ],
    };

    return (
        <div className="flex flex-col w-full max-w-[1170px] bg-white dark:bg-light-dark ">
            <Bar data={data} />
        </div>
    );
};
