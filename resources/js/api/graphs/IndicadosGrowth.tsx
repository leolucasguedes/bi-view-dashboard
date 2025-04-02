import React from "react";
import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";
import { UserDataFull } from "../../types";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface IndicadosGrowthProps {
    users: UserDataFull[];
    userId: number;
}

export const IndicadosGrowthChart: React.FC<IndicadosGrowthProps> = ({ users, userId }) => {
    const referralData: number[] = [];
    const labels: string[] = [];

    const currentDate = new Date();

    for (let i = 0; i < 4; i++) {
        const weekStartDate = startOfWeek(subDays(currentDate, i * 7), { weekStartsOn: 0 });
        const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 0 });

        const referralsInWeek = users.filter((user) => {
            const createdAtDate = new Date(user.created_at);
            return (
                createdAtDate >= weekStartDate &&
                createdAtDate <= weekEndDate &&
                user.user_id === userId
            );
        });

        referralData.push(referralsInWeek.length);
        labels.push(`Semana ${4 - i}`);
    }

    const lastWeekReferrals = referralData[0];

    const message = `Esta semana você indicou ${lastWeekReferrals} usuários.`;

    const data: ChartData<"line", number[], string> = {
        labels: labels.reverse(),
        datasets: [
            {
                label: "Indicações por semana",
                data: referralData.reverse(),
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
