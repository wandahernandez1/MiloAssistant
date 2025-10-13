import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [chatActive, setChatActive] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    return (
        <>
            <Navbar showProfile={true} />
            <div className={`dashboard-main-container ${chatActive ? "chat-active" : ""}`}>
                <Chat chatActive={chatActive} setChatActive={setChatActive} />
            </div>
        </>
    );
}
