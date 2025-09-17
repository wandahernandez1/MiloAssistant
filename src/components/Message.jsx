import React from "react";

export default function Message({ message, type, onClose }) {
    if (!message) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "15px 30px",
                borderRadius: 8,
                color: "white",
                backgroundColor:
                    type === "success" ? "#4CAF50" :
                        type === "error" ? "#F44336" :
                            "#2196F3",
                zIndex: 1000,
            }}
        >
            {message}
            <button onClick={onClose} style={{ marginLeft: 10 }}>X</button>
        </div>
    );
}
