import { useState, useRef, useEffect, useCallback } from "react";
import { getRouteByDepartureCode, getStationList } from "../firebase/firebase-related";

function KasehChat({ onClose, onNavigateToTrainTime }) { // Accept onNavigateToTrainTime as a prop
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [ticketInfo, setTicketInfo] = useState(null);
    const [restart, setRestart] = useState(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const time = formatTime(new Date());
        setMessages([
            {
                type: "bot",
                content: (
                    <>
                        Hai! saya <strong>KASEH</strong>. Boleh saya bantu? 🥰
                        <br />
                        <em>
                            Hi! I am <strong>KASEH</strong>, how may I assist you?
                        </em>
                    </>
                ),
                time,
                options: [
                    { label: "Book Ticket", action: startBookingFlow },
                    { label: "Check Arrival Time", action: onNavigateToTrainTime }, // Use the passed prop here
                ],
            },
        ]);
    }, [restart, onNavigateToTrainTime]);

    useEffect(() => {
        if (ticketInfo?.from && ticketInfo?.to && ticketInfo?.userType && ticketInfo?.numOfPassengers && ticketInfo?.tripType && ticketInfo?.price) {
            confirmTicket(ticketInfo);
        }
    }, [ticketInfo]);

    const formatTime = (time) =>
        new Date(time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

    const addBotMessage = (content, options = [], back = false) => {
        if (back) {
            options.push({
                label: "Back to main menu",
                action: () => {
                    setRestart(!restart);
                    setTicketInfo(null);
                },
            });
        }

        setMessages((prev) => [
            ...prev,
            {
                type: "bot",
                content,
                time: formatTime(new Date()),
                options,
            },
        ]);
    };

    const startBookingFlow = () => {
        queryOrigin();
    };

    const queryOrigin = async () => {
        const stations = await getStationList();
        const options = stations.map((station) => ({
            label: station.name,
            action: () => queryDestination(station.code),
        }));
        addBotMessage("Please select your departure station", options, true);
    };

    const queryDestination = async (departureStationCode) => {
        const routes = await getRouteByDepartureCode(departureStationCode);
        if (routes.length > 0) {
            const options = routes.map((route) => ({
                label: route.to,
                action: () => {
                    setTicketInfo({
                        from: route.from,
                        fromCode: route.fromCode,
                        to: route.to,
                        toCode: route.toCode,
                        priceMap: route.price,
                    });
                    queryTripType(route.isReturnAvailable);
                },
            }));
            addBotMessage("Please select your arrival station", options, true);
        } else {
            addBotMessage(
                "No route available for this departure station",
                [
                    {
                        label: "Back to departure station",
                        action: queryOrigin,
                    },
                ],
                true
            );
        }
    };

    const queryTripType = async (twoWayAvailable) => {
        const options = [
            {
                label: "one-way",
                action: () => {
                    setTicketInfo((prev) => ({ ...prev, tripType: "one-way" }));
                    queryUserType();
                },
            },
        ];
        if (twoWayAvailable) {
            options.push({
                label: "two-way",
                action: () => {
                    setTicketInfo((prev) => ({ ...prev, tripType: "two-way" }));
                    queryUserType();
                },
            });
        }
        addBotMessage("Please select your trip type", options, true);
    };

    const queryUserType = useCallback(() => {
        const userTypes = ["child", "adult", "senior"];
        const options = userTypes.map((type) => ({
            label: type,
            action: () => {
                setTicketInfo((prev) => {
                    const num = prev?.numOfPassengers || 1;
                    const multiplier = prev?.tripType === "two-way" ? 2 : 1;
                    return {
                        ...prev,
                        userType: type,
                        price: prev?.priceMap?.[type] * num * multiplier,
                    };
                });
                queryNumofPassenger();
            },
        }));
        addBotMessage("Please select your user type", options, true);
    }, []);

    const queryNumofPassenger = () => {
        const options = Array.from({ length: 10 }, (_, i) => i + 1).map((num) => ({
            label: num,
            action: () => {
                setTicketInfo((prev) => {
                    const multiplier = prev?.tripType === "two-way" ? 2 : 1;
                    return {
                        ...prev,
                        numOfPassengers: num,
                        price: prev?.priceMap?.[prev?.userType] * num * multiplier,
                    };
                });
            },
        }));
        addBotMessage("Please select number of passengers", options, true);
    };

    const confirmTicket = (info) => {
        const content = (
            <>
                <p>Confirm your ticket details:</p>
                <p>
                    <b>Departure Station:</b> {info.from}
                </p>
                <p>
                    <b>Arrival Station:</b> {info.to}
                </p>
                <p>
                    <b>Trip Type:</b> {info.tripType}
                </p>
                <p>
                    <b>Price:</b> RM {info.price}
                </p>
                <p>
                    <b>Number of Passengers:</b> {info.numOfPassengers}
                </p>
                <p>
                    <b>User Type:</b> {info.userType}
                </p>
            </>
        );

        const options = [{ label: "Confirm", action: () => {} }];

        addBotMessage(content, options, true);
    };

    const handleSendMessage = () => {
        const input = document.getElementById("message");
        const content = input.value.trim();
        if (!content) return;

        const newMessage = {
            type: "user",
            content,
            time: formatTime(new Date()),
        };

        setMessages((prev) => {
            const lastBot = prev[prev.length - 1];
            if (lastBot?.type === "bot" && lastBot.options?.length > 0) {
                 const selectedOption = lastBot.options.find((o) => content.toLowerCase().includes(o.label.toLowerCase()));
                if (selectedOption) {
                    selectedOption.action();
                }
                lastBot.options = [];
            }
            return [...prev, newMessage];
        });
        input.value = "";
    };

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
            border: "1px solid rgb(255, 0, 0)",
        },
        header: {
            padding: "11px 11px 11px 25px",
        },
        avatarText: {
            fontSize: "16px",
            fontWeight: 450,
        },
        messagesContainer: {
            backgroundColor: "#f5f5f5",
            marginTop: "4px",
            flex: "1",
            overflowY: "auto",
        },
        messageWrapper: {
            padding: "10px 20px"
        },
        botMessage: {
            padding: "10px 20px",
            marginTop: "10px",
            borderBottomLeftRadius: "0",
            width: "fit-content",
            maxWidth: '80%',
        },
        userMessage: {
            padding: "10px 20px",
            marginTop: "10px",
            borderRadius: "25px 25px 0 25px",
            backgroundColor: "#A8B5E0",
            color: "#fff",
            width: "fit-content",
            maxWidth: '80%',
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
            cursor: "pointer",
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
            backgroundColor: "transparent",
            border: "none",
        },
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header} className="bg-[#f5f5f5] flex items-start justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <img src="assets/img/bg.png" alt="avatar" className="w-10 h-10 rounded-full" />
                    <span style={styles.avatarText}>KASEH</span>
                </div>
                <button onClick={onClose} style={styles.iconButton}>
                    <img src="https://www.ktmb.com.my/assets/img/icon-chat-close.svg" alt="close" width="25" />
                </button>
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer}>
                <div style={styles.messageWrapper}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.type === "bot" ? (
                                <div>
                                    <div style={styles.botMessage} className="bg-white rounded-2xl shadow-sm text-sm text-gray-800">
                                        <div>{msg.content}</div>
                                        <div className="text-xs text-gray-400 mt-2 pt-2">{msg.time}</div>
                                    </div>
                                    {msg.options?.length > 0 && (
                                        <div style={{ marginTop: "5px" }} className="flex gap-2 flex-wrap">
                                            {msg.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setMessages((prev) => {
                                                            const tempMessages = prev.map((m, i) => 
                                                                i === index ? { ...m, options: [] } : m
                                                            );
                                                            tempMessages.push({ type: "user", content: option.label, time: formatTime(new Date()) });
                                                            return tempMessages;
                                                        });
                                                        option.action();
                                                    }}
                                                    style={styles.quickReply}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={styles.userMessage} className="shadow-sm text-sm">
                                    <div>{msg.content}</div>
                                    <div className="text-xs mt-2 pt-2 flex justify-end text-gray-200">
                                        {msg.time}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
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
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
