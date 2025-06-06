import { useState, useRef, useEffect } from "react";

function KasehChat() {
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            type: "bot",
            content: (
                <>
                    Hai! saya <strong>KASEH</strong>. Boleh saya bantu? 🥰
                    <br />
                    <em>
                        Hi! I am <strong>KASEH</strong>, how may I assist you?
                    </em>
                    <br />
                    <br />
                    <p style={{ fontWeight: "bold", fontSize: "11pt" }}>
                        Notis Penting / <em>Important Notice</em>
                    </p>
                    <img
                        src="https://ktmbstorage.blob.core.windows.net/ktmb-online-live-file/Announcement/OnlineAnnouncement.jpg?v=638613103309434155"
                        alt="Important Notice"
                        className="rounded-lg w-full max-w-xs mx-auto"
                    />
                </>
            ),
            time: "15:01",
        },
        {
            type: "bot",
            content: (
                <>
                    Sila pilih Bahasa <br />
                    Please select your language
                </>
            ),
            time: "15:02",
            options: [
                {
                    label: "Bahasa Melayu",
                    value: "ms",
                },
                {
                    label: "English",
                    value: "en",
                },
            ],
        },
    ]);

    const styles = {
        container: {
            position: "fixed",
            zIndex: 1100,
            bottom: "74px",
            right: "28px",
            top: "10%",
            backgroundColor: "#fff",
            maxWidth: "500px",
            width: "90%",
            borderRadius: "12px",
            boxShadow: "0px 0px 15px #00000040",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solidrgb(255, 0, 0)",
        },
        header: {
            padding: "11px 11px 11px 25px",
        },
        avatarText: {
            fontSize: "16px",
            fontWeight: 450,
        },
        closeButton: {
            borderColor: "transparent",
            padding: 0,
            margin: 0,
        },
        messagesContainer: {
            backgroundColor: "#f5f5f5",
            marginTop: "4px",
        },
        messageWrapper: {
            marginLeft: "40px",
            marginRight: "40px",
            marginTop: "10px",
            paddingBottom: "10px",
        },
        botMessage: {
            padding: "10px 20px",
            marginTop: "10px",
            borderBottomLeftRadius: "0",
            width: "80%",
        },
        userMessage: {
            padding: "5px 20px",
            marginTop: "10px",
            borderRadius: "25px 25px 0 25px",
            borderBottomRightRadius: "0",
            width: "80%",
            backgroundColor: "#A8B5E0",
            color: "#fff",
        },
        messageTime: {
            textAlign: "right",
            color: "#fff",
        },
        quickReply: {
            backgroundColor: "#a5a5a5",
            border: "1px solid #f3f3f3",
            padding: "5px 10px",
            borderRadius: "5px",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.2px",
            textDecoration: "none",
        },
        footer: {
            padding: "12px 14px",
            backgroundColor: "#bfbfbf",
        },
        input: {
            border: "1px solid #d5d5d5",
            borderRadius: "4px",
            padding: "5px 6px",
            backgroundColor: "#fff",
            color: "#818181",
        },
        iconButton: {
            borderColor: "transparent",
            padding: "3px 8px 4px",
        },
    };

    const handleSendMessage = () => {
        const newMessage = {
            type: "user",
            content: document.getElementById("message").value,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        };
        setMessages([...messages, newMessage]);
        document.getElementById("message").value = "";
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header} className="bg-[#f5f5f5] flex items-start justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <img src="assets/img/bg.png" alt="avatar" className="w-10 h-10 rounded-full" />
                    <span style={styles.avatarText}>KASEH</span>
                </div>
                <button
                    onClick={() => {
                        document.getElementById("root").style.display = "none";
                    }}
                    style={styles.closeButton}
                >
                    <img src="https://www.ktmb.com.my/assets/img/icon-chat-close.svg" alt="close" width="25" />
                </button>
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer} className="flex-1 overflow-y-auto">
                <div style={styles.messageWrapper}>
                    {messages.map((msg, index) =>
                        msg.type === "bot" ? (
                            <>
                                <div key={index} style={styles.botMessage} className="bg-white rounded-2xl shadow-sm text-sm text-gray-800">
                                    <div>{msg.content}</div>
                                    <div className="text-xs text-gray-400 mt-2 pt-2">{msg.time}</div>
                                </div>
                                {msg.options && (
                                    <div style={{ marginTop: "5px" }} className="flex gap-2">
                                        {msg.options.map((option, index) => (
                                            <button key={index} style={styles.quickReply}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex justify-end" key={index}>
                                <div style={styles.userMessage} className="rounded-2xl shadow-sm text-sm">
                                    <div style={{ fontSize: "16px" }}>{msg.content}</div>
                                    <div style={styles.messageTime} className="text-xs mt-2 pt-2">
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer} className="border-t border-gray-200 flex items-center gap-2">
                <input
                    id="message"
                    type="text"
                    style={styles.input}
                    className="flex-1 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Write your message here..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
                <button onClick={handleSendMessage} style={styles.iconButton}>
                    <img src="https://vpc-nubidesk.nubitel.io:7000/KtmbBot/Content/img/sendBtn.png" alt="send" className="w-6 h-6" />
                </button>
                <button style={styles.iconButton}>
                    <img src="https://vpc-nubidesk.nubitel.io:7000/KtmbBot/Content/img/attachment.png" alt="attachment" className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

export default KasehChat;
