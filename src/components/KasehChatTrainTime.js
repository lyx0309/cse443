import { useState, useRef, useEffect } from "react";
// Assuming your firebase services file is located at this path
import { getTimetable } from "../firebase/firebase-related";

function KasehChatTrainTime({ onClose, onBack }) {
    const bottomRef = useRef(null);
    const flowStarted = useRef(false);
    const [messages, setMessages] = useState([]);
    const [trainQuery, setTrainQuery] = useState({});

    // Effect to auto-scroll to the latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Effect to start the conversation flow once
    useEffect(() => {
        if (!flowStarted.current) {
            startTrainTimeFlow();
            flowStarted.current = true;
        }
    }, []);

    // Effect to manage the state of the conversation flow
    useEffect(() => {
        if (trainQuery.from && !trainQuery.to) {
            queryArrival(trainQuery.from);
        } else if (trainQuery.from && trainQuery.to && !trainQuery.time) {
            promptForTimeInput();
        } else if (trainQuery.from && trainQuery.to && trainQuery.time && !trainQuery.arrivalType) {
            askForArrivalTimeType();
        } else if (trainQuery.from && trainQuery.to && trainQuery.time && trainQuery.arrivalType) {
            displayTrainTime(trainQuery);
        }
    }, [trainQuery]);

    const formatTime = (time) => new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    // Helper to add a message from the bot to the chat
    const addBotMessage = (content, options = [], addBackButton = true) => {
        setMessages(prev => {
            // If the new message has options, clear all options from previous bot messages
            const updatedPrevMessages = options.length > 0 
                ? prev.map(m => (m.type === 'bot' ? { ...m, options: [] } : m))
                : prev;

            const messageOptions = [...options];
            if (addBackButton && options.length > 0) {
                messageOptions.push({ label: "Back to main menu", action: onBack });
            }

            return [...updatedPrevMessages, { type: "bot", content, time: formatTime(new Date()), options: messageOptions }];
        });
    };
    
    // Starts the flow by fetching stations and asking for departure
    const startTrainTimeFlow = async () => {
        // Reset the query state for a fresh start
        setTrainQuery({});
        addBotMessage("Please wait, I'm fetching the station list...", [], false);
        const timetable = await getTimetable();

        // This state update replaces the "loading" message with the station list
        setMessages(prev => {
            const newMessages = prev.filter(m => m.content !== "Please wait, I'm fetching the station list...");
            
            if (timetable && timetable.schedule && timetable.schedule.length > 0) {
                 const stationOptions = timetable.schedule.map((stop) => ({
                     label: stop.location,
                     action: () => setTrainQuery({ from: stop.location }),
                 }));
                 const finalOptions = [...stationOptions, { label: "Back to main menu", action: onBack }];
                 newMessages.push({ type: "bot", time: formatTime(new Date()), content: "Please select your departure station:", options: finalOptions });
            } else {
                 const finalOptions = [{ label: "Back to main menu", action: onBack }];
                 newMessages.push({ type: "bot", time: formatTime(new Date()), content: "Sorry, I couldn't fetch the station list. Please try again later.", options: finalOptions });
            }
            return newMessages;
        });
    };

    // Asks the user for their arrival station
    const queryArrival = async (from) => {
        const timetable = await getTimetable();
        const options = timetable.schedule
            .filter(stop => stop.location !== from)
            .map((stop) => ({
                label: stop.location,
                action: () => setTrainQuery((prev) => ({ ...prev, to: stop.location })),
            }));
        addBotMessage(`Great, you're departing from ${from}. Now, where are you heading?`, options, true);
    };

    // Displays the time input field
    const promptForTimeInput = () => {
        addBotMessage("What time will you be at the station? Please use the 24-hour format (e.g., 14:30).", [], false);
        const timeInputMessage = { type: 'time-input', id: `time-input-${Date.now()}` };
        setMessages(prev => [...prev, timeInputMessage]);
    };

    // Asks the user which arrival time they are interested in
    const askForArrivalTimeType = () => {
        const options = [
            { label: "Arrival at Departure Station", action: () => setTrainQuery(prev => ({ ...prev, arrivalType: 'departure' })) },
            { label: "Arrival at Destination Station", action: () => setTrainQuery(prev => ({ ...prev, arrivalType: 'destination' })) },
        ];
        addBotMessage("What would you like to check?", options, true);
    };

    // Fetches and displays the requested arrival time, then asks for the next action.
    const displayTrainTime = async ({ from, to, time, arrivalType }) => {
        const timetable = await getTimetable();
        if (!timetable || !timetable.schedule || !timetable.schedule.length) {
            addBotMessage(`Sorry, I couldn't find any train schedules.`, [], true);
            return;
        }

        const fromIndex = timetable.schedule.findIndex(s => s.location === from);
        const toIndex = timetable.schedule.findIndex(s => s.location === to);
        if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
             addBotMessage(`Sorry, a direct route from ${from} to ${to} was not found on this train line.`, [], true);
             return;
        }

        const departureTime = timetable.schedule[fromIndex].time;
        const destinationTime = timetable.schedule[toIndex].time;

        if (departureTime <= time) {
            addBotMessage(`Sorry, the train on this line has already departed.`, [], false);
            // Only show options to start over or go back
            const nextActions = [{ label: "Check another trip", action: startTrainTimeFlow }];
            addBotMessage("What would you like to do next?", nextActions, true);
        } else {
            let resultMessage = arrivalType === 'departure'
                ? `The next train (${timetable.trainNo}) from ${from} to ${to} is scheduled to arrive at your departure station (${from}) at ${departureTime}.`
                : `The next train (${timetable.trainNo}) from ${from} to ${to} is scheduled to arrive at your destination station (${to}) at ${destinationTime}.`;
            addBotMessage(resultMessage, [], false);

            const nextActions = [{ label: "Check another trip", action: startTrainTimeFlow }];
            
            if (arrivalType === 'departure') {
                nextActions.unshift({ 
                    label: "Check Destination Arrival Time",
                    action: () => setTrainQuery(prev => ({ ...prev, arrivalType: 'destination' }))
                });
            } 
            else {
                 nextActions.unshift({
                    label: "Check Departure Arrival Time",
                    action: () => setTrainQuery(prev => ({ ...prev, arrivalType: 'departure' }))
                });
            }
            
            addBotMessage("What would you like to do next?", nextActions, true);
        }
    };

    const handleOptionClick = (option, messageIndex) => {
        const userMessageContent = option.label;
        setMessages(prev => {
            const updatedMessages = prev.map((m, i) => i === messageIndex ? { ...m, options: [] } : m);
            updatedMessages.push({ type: "user", content: userMessageContent, time: formatTime(new Date()) });
            return updatedMessages;
        });
        option.action();
    };
    
    const handleSendMessage = () => {
        const input = document.getElementById("message-input-arrival");
        if (!input || !input.value.trim()) return;
        setMessages(prev => [...prev, { type: "user", content: input.value.trim(), time: formatTime(new Date()) }]);
        input.value = "";
    };
    
    const styles = {
        container: { position: "fixed", zIndex: 1100, bottom: "74px", right: "28px", top: "10%", backgroundColor: "#fff", maxWidth: "500px", width: "90%", borderRadius: "12px", boxShadow: "0px 0px 15px #00000040", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid rgb(255, 0, 0)" },
        header: { padding: "11px 11px 11px 25px" },
        avatarText: { fontSize: "16px", fontWeight: 450 },
        messagesContainer: { backgroundColor: "#f5f5f5", marginTop: "4px", flex: "1", overflowY: "auto" },
        messageWrapper: { padding: "10px 20px" },
        botMessage: { padding: "10px 20px", marginTop: "10px", borderBottomLeftRadius: "0", width: "fit-content", maxWidth: '90%' },
        userMessage: { padding: "10px 20px", marginTop: "10px", borderRadius: "25px 25px 0 25px", backgroundColor: "#A8B5E0", color: "#fff", width: "fit-content", maxWidth: '80%' },
        quickReply: { backgroundColor: "#a5a5a5", border: "1px solid #f3f3f3", padding: "8px 12px", borderRadius: "5px", color: "#ffffff", fontSize: "13px", fontWeight: 500, letterSpacing: "0.2px", textDecoration: "none", cursor: "pointer" },
        footer: { padding: "12px 14px", backgroundColor: "#bfbfbf" },
        input: { border: "1px solid #d5d5d5", borderRadius: "4px", padding: "5px 6px", backgroundColor: "#fff", color: "#818181" },
        iconButton: { borderColor: "transparent", padding: "3px 8px 4px", backgroundColor: "transparent", border: "none" },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} className="bg-[#f5f5f5] flex items-start justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <img src="assets/img/bg.png" alt="avatar" className="w-10 h-10 rounded-full" />
                    <span style={styles.avatarText}>KASEH</span>
                </div>
                <button onClick={onClose} style={styles.iconButton}><img src="https://www.ktmb.com.my/assets/img/icon-chat-close.svg" alt="close" width="25" /></button>
            </div>
            <div style={styles.messagesContainer}>
                <div style={styles.messageWrapper}>
                    {messages.map((msg, index) => {
                        if (msg.type === 'time-input') {
                            const inputId = `time-input-field-${msg.id}`;
                            return (
                                <div key={msg.id} className="w-full flex justify-center my-3">
                                    <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3 w-full max-w-xs">
                                        <div 
                                            className="flex-grow cursor-pointer"
                                            onClick={() => {
                                                const timeInput = document.getElementById(inputId);
                                                if (timeInput?.showPicker) {
                                                    timeInput.showPicker();
                                                }
                                            }}
                                        >
                                            <input 
                                                type="time" 
                                                id={inputId}
                                                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm"
                                                style={{ pointerEvents: "none" }} // Prevents double-opening the picker
                                            />
                                        </div>
                                        <button 
                                            style={styles.quickReply}
                                            onClick={() => {
                                                const timeInput = document.getElementById(inputId);
                                                if (timeInput?.value) {
                                                    const selectedTime = timeInput.value;
                                                    setMessages(prev => {
                                                        const updatedMessages = prev.filter(m => m.id !== msg.id);
                                                        updatedMessages.push({ type: 'user', content: `My time: ${selectedTime}`, time: formatTime(new Date()) });
                                                        return updatedMessages;
                                                    });
                                                    setTrainQuery(prev => ({ ...prev, time: selectedTime }));
                                                }
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                        
                        return (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.type === "bot" ? (
                                    <div className="w-full">
                                        <div style={styles.botMessage} className="bg-white rounded-2xl shadow-sm text-sm text-gray-800">
                                            <div>{msg.content}</div>
                                            <div className="text-xs text-gray-400 mt-2 pt-2">{msg.time}</div>
                                        </div>
                                        {msg.options?.length > 0 && (
                                            <div style={{ marginTop: "5px" }} className="flex gap-2 flex-wrap">
                                                {msg.options.map((option, idx) => (
                                                    <button key={idx} onClick={() => handleOptionClick(option, index)} style={styles.quickReply}>
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={styles.userMessage} className="shadow-sm text-sm">
                                        <div>{msg.content}</div>
                                        <div className="text-xs mt-2 pt-2 flex justify-end text-gray-200">{msg.time}</div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>
            </div>
            <div style={styles.footer} className="border-t border-gray-200 flex items-center gap-2">
                <input id="message-input-arrival" type="text" style={styles.input} className="flex-1 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Write your message here..." onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
                <button onClick={handleSendMessage} style={styles.iconButton}><img src="https://vpc-nubidesk.nubitel.io:7000/KtmbBot/Content/img/sendBtn.png" alt="send" className="w-6 h-6" /></button>
                <button style={styles.iconButton}><img src="https://vpc-nubidesk.nubitel.io:7000/KtmbBot/Content/img/attachment.png" alt="attachment" className="w-6 h-6" /></button>
            </div>
        </div>
    );
}

export default KasehChatTrainTime;
