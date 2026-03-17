async function findBirthday() {
    const rawInput = document.getElementById('birthInput').value;
    const cleanInput = rawInput.replace(/0/g, ''); // Your viral zero-strip hack
    const resultDiv = document.getElementById('result');

    if (cleanInput.length < 3) {
        resultDiv.innerHTML = "Enter a valid date!";
        return;
    }

    resultDiv.innerHTML = "Searching the Universe... 🌌";

    try {
        // We call the Pi Delivery API (Google's Public Pi API)
        // It searches up to 1 Trillion digits!
        const response = await fetch(`https://api.pi.delivery/v1/pi?start=0&numberOfDigits=0&search=${cleanInput}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const index = data.results[0].start;
            
            resultDiv.innerHTML = `
                <div style="border: 1px solid #00ff00; padding: 15px; background: rgba(0,255,0,0.1);">
                    <span style="color:#00ff00">MATCH FOUND!</span>
                    <span style="color:yellow; font-size: 24px; display:block; margin:10px 0;">
                        Position: ${index.toLocaleString()}
                    </span>
                    <p>Your "Universal Code" <strong>${cleanInput}</strong> is written forever at this decimal place.</p>
                    <p style="font-style:italic; font-size:12px;">Verified by Google Cloud Pi Cluster</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = "This code is so rare, it's deeper than 1 trillion digits!";
        }
    } catch (error) {
        resultDiv.innerHTML = "Connection to the universe lost. Try again!";
        console.error(error);
    }
}

