import React from "react";

export default function ChatInput({ inputValue, setInputValue, onSend, onMinimize }) {
    return (
        <div className="chat-input-container">
            <input
                type="text"
                placeholder="Escribe un mensaje a Milo..."
                className="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
            />
            <button className="send-button" onClick={onSend}>
                <i className="fas fa-paper-plane"></i>
            </button>
            <button className="minimize-chat-button" onClick={onMinimize}>
                <i className="fas fa-arrow-up"></i>
                <span>Volver al Inicio</span>
            </button>
        </div>
    );
}
