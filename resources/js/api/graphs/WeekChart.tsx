import React, { useEffect, useState, useRef } from "react";
import Chart, { ChartOptions, TickOptions, ArcElement } from "chart.js/auto";
import { UserData } from "../../types";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
Chart.register(ArcElement);

interface Props {
    users: UserData[];
}

export const WeeklyContactGraph: React.FC<Props> = ({ users }) => {
    const [weeklyData, setWeeklyData] = useState<number[]>([]);
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const weeklyCounts = getWeeklyCounts(users);
                setWeeklyData(weeklyCounts);
            } catch (error) {
                console.error("Erro ao buscar dados dos usuários:", error);
            }
        };

        fetchData();
    }, [users]);

    useEffect(() => {
        if (weeklyData.length > 0) {
            renderChart();
        }
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [weeklyData]);

    const getWeeklyCounts = (userData: UserData[]): number[] => {
        const currentDate = new Date();
        const weeklyCounts: number[] = [];

        for (let i = 4; i >= 0; i--) {
            const startDate = startOfWeek(subDays(currentDate, i * 7), {
                weekStartsOn: 0,
            });
            const endDate = endOfWeek(startDate, { weekStartsOn: 0 });

            const count = userData.filter((user) => {
                const userCreatedAt = new Date(user.created_at);
                return userCreatedAt >= startDate && userCreatedAt <= endDate;
            }).length;

            weeklyCounts.push(count);
        }

        return weeklyCounts;
    };

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                const lastWeeksLabels = getLastWeeksLabels(5);

                chartRef.current = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: lastWeeksLabels,
                        datasets: [
                            {
                                label: "Contatos Semanais",
                                data: weeklyData,
                                backgroundColor: "rgba(54, 162, 235, 1)",
                                borderColor: "rgba(23, 125, 255, 0.5)",
                                tension: 0.1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 2,
                                    max: 14,
                                } as Partial<TickOptions>,
                            },
                        },
                    } as ChartOptions,
                });
            }
        }
    };

    const getLastWeeksLabels = (numberOfWeeks: number): string[] => {
        const labels: string[] = [];

        for (let i = numberOfWeeks - 1; i >= 0; i--) {
            const startDate = startOfWeek(subDays(new Date(), i * 7), {
                weekStartsOn: 0,
            });
            const endDate = endOfWeek(startDate, { weekStartsOn: 0 });

            const label = `${format(startDate, "dd/MM/yyyy")} - ${format(
                endDate,
                "dd/MM/yyyy"
            )}`;
            labels.push(label);
        }

        return labels;
    };

    return <canvas ref={canvasRef} id="weeklyContactGraph" />;
};
