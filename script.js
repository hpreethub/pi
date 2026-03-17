let fullPi = "";
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status');
const searchBox = document.getElementById('search-box');

// CONFIG: Replace this with the actual URL of your 100MB file
const PI_FILE_URL = 'pi-100m.txt'; 

async function loadPi() {
    try {
        const response = await fetch(PI_FILE_URL);
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        
        let receivedLength = 0;
        let chunks = []; 

        while(true) {
            const {done, value} = await reader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;

            // Update Progress Bar
            let percent = Math.floor((receivedLength / contentLength) * 100);
            progressBar.style.width = percent + '%';
            statusText.innerText = `Downloading Universe: ${percent}% (${(receivedLength/1024/1024).toFixed(1)} MB)`;
        }

        // Combine all chunks into one massive string
        statusText.innerText = "Finalizing data... please wait.";
        let allChunks = new Uint8Array(receivedLength);
        let position = 0;
        for(let chunk of chunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
        }
        
        fullPi = new TextDecoder("utf-8").decode(allChunks);
        
        // Hide loading, show search
        document.getElementById('progress-container').style.display = 'none';
        statusText.innerText = "✅ 100 Million Digits Ready.";
        searchBox.style.display = 'block';

    } catch (error) {
        statusText.innerText = "Error loading data. Make sure pi-100m.txt exists!";
        console.error(error);
    }
}

function findBirthday() {
    const rawInput = document.getElementById('birthInput').value;
    const cleanInput = rawInput.replace(/0/g, ''); // The "Viral Hack": Remove Zeros
    const resultDiv = document.getElementById('result');

    if (cleanInput.length < 3) {
        resultDiv.innerHTML = "Enter a valid date!";
        return;
    }

    const index = fullPi.indexOf(cleanInput);

    if (index !== -1) {
        // Find context (10 digits before and after)
        const start = Math.max(0, index - 10);
        const end = Math.min(fullPi.length, index + cleanInput.length + 10);
        const snippet = fullPi.substring(start, end);
        
        // Final Output
        resultDiv.innerHTML = `
            <div style="border: 1px solid var(--neon); padding: 15px;">
                <span style="color:var(--neon)">MATCH FOUND IN UNIVERSE!</span>
                <span class="pos-num"># ${index.toLocaleString()}</span>
                <p>Snippet: ...${snippet.replace(cleanInput, `<span class="highlight">${cleanInput}</span>`)}...</p>
                <p style="font-size:12px; color:#666;">(Note: Zeros removed to align with Universal Frequency)</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = "<p>Code not found in first 100M digits. You are beyond the matrix!</p>";
    }
}

// Start loading on page open
loadPi();