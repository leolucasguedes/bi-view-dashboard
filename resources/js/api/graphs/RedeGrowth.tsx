import React from "react";
import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";
import { UserDataFull } from "../../types";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface NetworkGrowthProps {
    users: UserDataFull[];
    userId: number;
}

const getNetworkSize = (users: UserDataFull[], userId: number): number => {
    const directReferrals = users.filter(user => user.user_id === userId);
    let networkSize = directReferrals.length;

    directReferrals.forEach(user => {
        networkSize += getNetworkSize(users, user.id);
    });

    return networkSize;
};

export const RedeGrowthChart: React.FC<NetworkGrowthProps> = ({ users, userId }) => {
    const networkData: number[] = [];
    const labels: string[] = [];

    const currentDate = new Date();

    for (let i = 0; i < 4; i++) {
        const weekStartDate = startOfWeek(subDays(currentDate, i * 7), { weekStartsOn: 0 });
        const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 0 });

        const networkInWeek = users.filter((user) => {
            const createdAtDate = new Date(user.created_at);
            return (
                createdAtDate >= weekStartDate && createdAtDate <= weekEndDate
            );
        });

        const networkSize = getNetworkSize(networkInWeek, userId);
        networkData.push(networkSize);
        labels.push(`Semana ${4 - i}`);
    }

    const lastWeekNetworkGrowth = networkData[0];

    const message = `Esta semana sua rede cresceu ${lastWeekNetworkGrowth} usuários.`;

    const data: ChartData<"line", number[], string> = {
        labels: labels.reverse(),
        datasets: [
            {
                label: "Crescimento da Rede por semana",
                data: networkData.reverse(),
                fill: false,
                backgroundColor: "rgba(54, 162, 235, 1)",
                borderColor: "rgba(23, 125, 255, 0.5)",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                precision: 0,
            },
        },
    };

    return (
        <div className="flex flex-col px-2 w-full max-w-[770px] bg-white dark:bg-light-dark">
            <div className="w-auto p-2 mt-2 rounded-lg">
                <p className="text-custom-gray2 dark:text-white text-16px font-montserrat font-semibold">
                    {message}
                </p>
            </div>
            <Line data={data} options={options} />
        </div>
    );
};
