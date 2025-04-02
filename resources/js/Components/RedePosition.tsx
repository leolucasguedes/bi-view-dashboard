import axios from "axios";
import React, { useState, useEffect } from "react";
import { PiMedalFill } from "react-icons/pi";

interface Props {
    id: number;
    admin: boolean;
}

export const RedePosition = ({ id, admin }: Props) => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post("api/nav", {
                    userId: id,
                });

                if (response.data.success) {
                    const userPosition = response.data.data.position;
                    setPosition(userPosition);
                    const timestamp = new Date().getTime();
                    localStorage.setItem(`user_${id}_position`, userPosition);
                    localStorage.setItem(
                        `user_${id}_timestamp`,
                        timestamp.toString()
                    );
                } else {
                    const storedPosition = localStorage.getItem(
                        `user_${id}_position`
                    );
                    if (storedPosition) {
                        setPosition(parseInt(storedPosition, 10));
                    }
                }
            } catch (error) {
                console.log(error);
                const storedPosition = localStorage.getItem(
                    `user_${id}_position`
                );
                if (storedPosition) {
                    setPosition(parseInt(storedPosition, 10));
                }
            }
        };

        const checkCache = () => {
            const storedTimestamp = localStorage.getItem(
                `user_${id}_timestamp`
            );
            const currentTime = new Date().getTime();
            const oneHour = 60 * 60 * 1000;

            if (
                storedTimestamp &&
                currentTime - parseInt(storedTimestamp, 10) < oneHour
            ) {
                const storedPosition = localStorage.getItem(
                    `user_${id}_position`
                );
                if (storedPosition) {
                    setPosition(parseInt(storedPosition, 10));
                    return;
                }
            }
            getData();
        };

        if (!admin && id) {
            checkCache();
        }
    }, [id, admin]);

    function getColor(userIndex: number) {
        let color;
        if (userIndex === 1) {
            color = "text-yellow-500";
        } else if (userIndex === 2) {
            color = "text-silver";
        } else if (userIndex === 3) {
            color = "text-bronze";
        } else {
            color = "text-custom-blue";
        }
        return color;
    }

    let colorMedal = getColor(position);

    return (
        <div className="flex gap-1">
            <PiMedalFill className={`size-7 ${colorMedal}`} />
            <p className="text-12px mt-1.5 font-semibold font-poppins dark:text-white">
                Ranking{" "}
            </p>
            {!admin ? (
                <span className="font-bold text-16px dark:text-white">
                    {position}º
                </span>
            ) : (
                <span className="font-bold text-16px mt-0.5 dark:text-white">
                    Admin
                </span>
            )}
        </div>
    );
};
