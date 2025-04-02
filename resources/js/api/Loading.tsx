import React from "react";
import { CircularProgress } from "@mui/material";
import ApplicationLogo from "../Components/ApplicationLogo";

const Loading: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <ApplicationLogo className="h-12 w-12" />
            <div style={{ marginTop: "20px" }}>
                <CircularProgress color="primary" />
            </div>
        </div>
    );
};

export default Loading;
