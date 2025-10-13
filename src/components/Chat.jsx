import React from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ActionCards from "./ActionCards";
import { useChatLogic } from "../hooks/useChatLogic";
import miloAvatar from "../assets/milo2.jpg";
import "../styles/dashboard.css";

export default function Chat({ chatActive, setChatActive }) {
    const { messages, inputValue, setInputValue, isLoading, handleSend, handleCardClick, handleMinimize } = useChatLogic(setChatActive);

    return (
        <section className="chat-section">
            {!chatActive && (
                <div className="chat-initial-content">
                    <div className="intro-section-wrapper">
                        <section className="intro-section">
                            <img src={miloAvatar} alt="Milo Avatar" className="milo-avatar" />
                            <h1>Hola, soy <span className="highlight">Milo,</span> tu asistente personal.</h1>
                            <p className="question">¿Qué te gustaría hacer hoy?</p>
                        </section>
                    </div>
                    <ActionCards handleCardClick={handleCardClick} />
                </div>
            )}

            <div className="chat-messages">
                {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
                {isLoading && (
                    <div className="chat-message milo thinking-message">
                        <div className="typing-indicator"><span></span><span></span><span></span></div>
                        <p>Milo está escribiendo...</p>
                    </div>
                )}
            </div>

            <ChatInput inputValue={inputValue} setInputValue={setInputValue} onSend={handleSend} onMinimize={handleMinimize} />
        </section>
    );
}
