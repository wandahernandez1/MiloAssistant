// src/hooks/useMessages.js
import { useState } from "react";

export function useMessages() {
    const [message, setMessage] = useState(null);
    const [type, setType] = useState("info");

    const showMessage = (msg, msgType = "info") => {
        setMessage(msg);
        setType(msgType);
        setTimeout(() => setMessage(null), 3000);
    };

    return { message, type, showMessage };
}
