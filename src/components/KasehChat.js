import { useState, useRef, useEffect, useCallback } from "react";
import { expandTrainTimesByStation, getRouteByDepartureCode, getStationList, insertBookingData } from "../firebase/firebase-related";
import { generateTicketQRCodesPdf } from "../PDFGenerator";

function KasehChat({ onClose }) {
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([]);
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
                    { label: "Check Arrival Time", action: handleCheckArrivalTime },
                ],
            },
        ]);
    }, [restart]);

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

    const handleCheckArrivalTime = () => {
        // handle check arrival time
    };

    const steps = [
        "selectOrigin",
        "selectDestination",
        "selectTripType",
        "selectUserType",
        "selectNumOfPassengers",
        "confirmTicket",
        "payTicket",
        "generateTicketPdf",
    ];
    const [currentStep, setCurrentStep] = useState(0);

    const bookingFlow = async (stepIndex = currentStep, data = null) => {
        const step = steps[stepIndex]; // get the current step

        // handle the current step
        switch (step) {
            // Case 1: User selects origin station
            case "selectOrigin":
                try {
                    // Fetch the list of stations then display as options
                    const stations = await getStationList();
                    addBotMessage(
                        "Please select your departure station",
                        stations.map((station) => ({
                            label: station.name,
                            action: () => bookingFlow(stepIndex + 1, { ...data, from: station.name, fromCode: station.code }),
                        })),
                        true
                    );
                } catch (error) {
                    console.error("Error fetching data:", error);
                    addBotMessage("⚠️ Failed to load stations. Please try again later.", [], true);
                }
                break;

            // Case 2: User selects destination station
            case "selectDestination":
                try {
                    // Fetch the list of routes based on selected originthen display as options
                    const routes = await getRouteByDepartureCode(data.fromCode);

                    // if no route available
                    if (routes.length === 0) {
                        addBotMessage(
                            "No route available",
                            [
                                {
                                    label: "Back",
                                    action: () => bookingFlow(0),
                                },
                            ],
                            true
                        );
                        return;
                    }

                    // if route available then display
                    addBotMessage(
                        "Please select your arrival station",
                        routes.map((route) => ({
                            label: route.to,
                            action: () =>
                                bookingFlow(stepIndex + 1, {
                                    ...data,
                                    to: route.to,
                                    toCode: route.toCode,
                                    priceMap: route.price,
                                    isReturnAvailable: route.isReturnAvailable,
                                }),
                        })),
                        true
                    );
                } catch (error) {
                    console.error("Failed to fetch routes:", error);
                    addBotMessage("⚠️ Failed to load routes. Please try again.", [], true);
                }
                break;

            // Case 3: User selects trip type (one-way or two-way)
            case "selectTripType":
                // define options
                const options = [
                    {
                        label: "one-way",
                        action: () => bookingFlow(stepIndex + 1, { ...data, tripType: "one-way" }),
                    },
                ];

                // check if route support two-way
                if (data.isReturnAvailable) {
                    options.push({
                        label: "two-way",
                        action: () => bookingFlow(stepIndex + 1, { ...data, tripType: "two-way" }),
                    });
                }

                // add bot message
                addBotMessage("Please select your trip type", options, true);
                break;

            // Case 4: User selects user type (child, adult, senior)
            case "selectUserType":
                const userTypes = ["child", "adult", "senior"]; // 3 user types
                addBotMessage(
                    "Please select your user type",
                    userTypes.map((type) => ({
                        label: type,
                        action: () => bookingFlow(stepIndex + 1, { ...data, userType: type }),
                    })),
                    true
                );
                break;

            // Case 5: User selects number of passengers/tickets
            case "selectNumOfPassengers":
                addBotMessage(
                    "Please select number of passengers",
                    Array.from({ length: 10 }, (_, i) => ({
                        // options 1 to 10
                        label: (i + 1).toString(),
                        action: () => {
                            const multiplier = data.tripType === "two-way" ? 2 : 1;
                            const price = data.priceMap?.[data.userType] * (i + 1) * multiplier;
                            bookingFlow(stepIndex + 1, { ...data, numOfPassengers: i + 1, price });
                        },
                    })),
                    true
                );
                break;

            // Case 6: User cofirms the ticket details
            case "confirmTicket":
                const content = (
                    <>
                        <p>Confirm your ticket details:</p>
                        <p>
                            <b>Departure Station:</b> {data.from}
                        </p>
                        <p>
                            <b>Arrival Station:</b> {data.to}
                        </p>
                        <p>
                            <b>Trip Type:</b> {data.tripType}
                        </p>
                        <p>
                            <b>Price:</b> RM {data.price}
                        </p>
                        <p>
                            <b>Number of Passengers:</b> {data.numOfPassengers}
                        </p>
                        <p>
                            <b>User Type:</b> {data.userType}
                        </p>
                    </>
                );

                addBotMessage(
                    content,
                    [
                        {
                            label: "Confirm",
                            action: () => {
                                bookingFlow(stepIndex + 1, data);
                            },
                        },
                    ],
                    true
                );
                break;

            // Case 7: User pays for the ticket
            case "payTicket":
                // fake payment qr
                const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + "https://www.hariwang.com.my/dummy-payment-gateway/";
                const payContent = (
                    <div>
                        Scan to Pay <br />
                        <img src={qrUrl} />
                    </div>
                );
                addBotMessage(payContent, []);

                // assume payment is successful made by user (using 5 seconds delay)
                setTimeout(async () => {
                    bookingFlow(stepIndex + 1, data);
                }, 5000);

                break;

            // Case 8: User downloads the ticket
            case "generateTicketPdf":
                try {
                    // generate tickets based on number of passengers selected
                    // pdf and list of ticket ids returned
                    const { doc, ticketIdArray } = await generateTicketQRCodesPdf(data.numOfPassengers);

                    // insert booking data to firebase
                    await insertBookingData(data, ticketIdArray);

                    // prepare link to download pdf
                    const blob = doc.output("blob");
                    const url = URL.createObjectURL(blob);
                    const message = (
                        <div>
                            Your ticket has been successfully booked!{" "}
                            <a style={{ cursor: "pointer" }} onClick={() => doc.save("tickets.pdf")}>
                                Download PDF
                            </a>
                        </div>
                    );
                    addBotMessage(message, [], true);

                    // direct open pdf on browser
                    window.open(url);
                } catch (error) {
                    console.error("PDF generation or booking failed:", error);
                    addBotMessage("❌ Failed to generate ticket. Please try again later.", [], true);
                }
                break;
            // Default
            default:
                console.error("Invalid stepIndex:", stepIndex);
                break;
        }

        setCurrentStep(stepIndex);
    };

    const startBookingFlow = () => {
        setCurrentStep(0);
        bookingFlow(0);
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
            lastBot?.type === "bot" &&
                lastBot.options?.length > 0 &&
                lastBot.options.find((o) => content.toLowerCase().includes(o.label.toLowerCase()))?.action();
            lastBot.options = [];
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
            <div style={styles.messagesContainer} className="flex-1 overflow-y-auto">
                <div style={styles.messageWrapper}>
                    {messages.map((msg, index) => (
                        <div key={index}>
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
                                                        // Remove the quick reply from the message
                                                        setMessages((prev) => {
                                                            const tempMessages = prev.map((m, i) => {
                                                                return i === index ? { ...m, options: [] } : m;
                                                            });
                                                            tempMessages.push({ type: "user", content: option.label, time: formatTime(new Date()) });
                                                            return tempMessages;
                                                        });
                                                        option.action();
                                                    }}
                                                    style={{
                                                        ...styles.quickReply,
                                                        ...(option?.selected && {
                                                            backgroundColor: "#A8B5E0",
                                                            color: "#fff",
                                                        }),
                                                    }}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <div style={styles.userMessage} className="rounded-2xl shadow-sm text-sm">
                                        <div style={{ fontSize: "16px" }}>{msg.content}</div>
                                        <div style={styles.messageTime} className="text-xs mt-2 pt-2 flex justify-end">
                                            {msg.time}
                                        </div>
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
