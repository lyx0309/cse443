import { useState } from "react";
import "./App.css";
import KasehChat from "./components/KasehChat";

function App() {
    const [chatDisplay, setChatDisplay] = useState(false);

    return (
        <>
            <button
                onClick={() => {
                    setChatDisplay(!chatDisplay);
                }}
                id="chatpopup"
                style={{ position: "fixed", bottom: "74px", right: "28px", zIndex: 1000, backgroundColor: "transparent", border: "none", padding: 0 }}
            >
                <img src="assets/img/kaseh-chatbot.png" width="180" />
            </button>
            {chatDisplay && <KasehChat onClose={() => setChatDisplay(false)} />}
        </>
    );
}

export default App;
