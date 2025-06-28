import jsPDF from "jspdf";

// Generate a random alphanumeric ticket ID
function generateRandomTicketId(length = 24) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

// Convert image URL to base64 for embedding in PDF
async function toDataURL(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
        const blob = await res.blob();

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject("Failed to convert image to base64");
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error in toDataURL:", error);
        throw error;
    }
}

// Main PDF generator
export async function generateTicketQRCodesPdf(numTickets = 1) {
    const ticketIdArray = [];

    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        for (let i = 0; i < numTickets; i++) {
            if (i !== 0) doc.addPage();

            const ticketId = generateRandomTicketId();
            ticketIdArray.push(ticketId);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticketId}`;
            const imgData = await toDataURL(qrUrl);

            const pageWidth = doc.internal.pageSize.getWidth();
            const qrSize = 130; // in mm
            const x = (pageWidth - qrSize) / 2;
            const y = 50; // top offset

            // Add QR image
            doc.addImage(imgData, "PNG", x, y, qrSize, qrSize);

            // Add ticket ID text below the QR
            doc.setFontSize(16);
            doc.text(`Ticket ID: ${ticketId}`, pageWidth / 2, y + qrSize + 15, { align: "center" });
        }

        return { doc, ticketIdArray };
    } catch (error) {
        console.error("Failed to generate ticket PDF:", error);
        throw new Error("Unable to generate ticket PDF. Please try again.");
    }
}
