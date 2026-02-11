const sendBtn = document.getElementById('sendBtn');
const responseContainer = document.getElementById('responseContainer');
const statusBadge = document.getElementById('statusBadge');
const timeBadge = document.getElementById('timeBadge');
const responseBody = document.getElementById('responseBody');

function switchTab(tab) {
    document.getElementById('json-input').style.display = tab === 'json' ? 'block' : 'none';
    document.getElementById('headers-input').style.display = tab === 'headers' ? 'block' : 'none';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

sendBtn.addEventListener('click', async () => {
    const url = document.getElementById('url').value;
    const method = document.getElementById('method').value;
    const bodyText = document.getElementById('requestBody').value;
    const headersText = document.getElementById('requestHeaders').value;

    if (!url) { alert("Please enter a URL"); return; }

    sendBtn.textContent = "Pinging...";
    sendBtn.disabled = true;
    responseBody.textContent = "Loading...";
    responseContainer.classList.remove('hidden');
    
    statusBadge.style.backgroundColor = '#ccc';
    statusBadge.textContent = "Status: ...";
    timeBadge.style.backgroundColor = '#ccc';
    timeBadge.textContent = "Ping: ...";

    try {
        const body = bodyText ? JSON.parse(bodyText) : null;
        const headers = headersText ? JSON.parse(headersText) : null;

        const res = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, method, headers, body })
        });

        const data = await res.json();

        statusBadge.textContent = `Status: ${data.status} ${data.statusText}`;
        if (data.status >= 200 && data.status < 300) statusBadge.style.backgroundColor = '#28a745';
        else if (data.status >= 400 && data.status < 500) statusBadge.style.backgroundColor = '#ffc107';
        else statusBadge.style.backgroundColor = '#dc3545';

        timeBadge.textContent = `Ping: ${data.duration} ms`;
        
        if (data.duration < 300) {
            timeBadge.style.backgroundColor = '#28a745';
        } else if (data.duration < 800) {
            timeBadge.style.backgroundColor = '#fd7e14';
        } else {
            timeBadge.style.backgroundColor = '#dc3545';
        }
        responseBody.textContent = JSON.stringify(data.data, null, 2);

    } catch (err) {
        responseBody.textContent = "Error: " + err.message;
        timeBadge.textContent = "Ping: Failed";
        timeBadge.style.backgroundColor = '#dc3545';
    } finally {
        sendBtn.textContent = "Send Request";
        sendBtn.disabled = false;
    }
});
