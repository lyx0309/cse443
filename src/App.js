import { useState } from "react";
import "./App.css";
import KasehChat from "./components/KasehChat";
import KasehChatTrainTime from "./components/KasehChatTrainTime";

function App() {
    const [chatDisplay, setChatDisplay] = useState(false);
    const [chatView, setChatView] = useState('main'); // Can be 'main' or 'trainTime'

    const openChat = () => {
        setChatDisplay(true);
        setChatView('main'); // Always start at the main menu
    };

    const closeChat = () => {
        setChatDisplay(false);
    };

    const navigateToTrainTime = () => {
        setChatView('trainTime');
    };

    const navigateToMain = () => {
        setChatView('main');
    };

    return (
        <>
            <button
                onClick={openChat}
                id="chatpopup"
                style={{ position: "fixed", bottom: "74px", right: "28px", zIndex: 1000, backgroundColor: "transparent", border: "none", padding: 0 }}
            >
                <img src="assets/img/kaseh-chatbot.png" alt="Kaseh Chatbot" width="180" />
            </button>
            
            {chatDisplay && (
                <>
                    {chatView === 'main' && (
                        <KasehChat 
                            onClose={closeChat} 
                            onNavigateToTrainTime={navigateToTrainTime} 
                        />
                    )}
                    {chatView === 'trainTime' && (
                        <KasehChatTrainTime 
                            onClose={closeChat} 
                            onBack={navigateToMain} 
                        />
                    )}
                </>
            )}
        </>
    );
}

export default App;
