const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/proxy', async (req, res) => {
    const { url, method, headers, body } = req.body;

    console.log(`Testing API: [${method}] ${url}`);

    try {
        const startTime = Date.now();
        
        const response = await axios({
            url: url,
            method: method,
            headers: headers || {},
            data: body || null,
            validateStatus: () => true 
        });

        const endTime = Date.now();

        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            duration: endTime - startTime
        });

    } catch (error) {
        res.status(500).json({
            error: "Request Failed",
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});