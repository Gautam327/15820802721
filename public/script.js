document.getElementById('fetchNumbers').addEventListener('click', async () => {
    const type = document.getElementById('type').value;

    try {
        // Replace with your actual username and password or use environment variables
        const username = 'Gautam';
        const password = '123456789';
        
        // Encode username and password for Basic Authentication
        const credentials = btoa(`${username}:${password}`);

        const response = await fetch(`/numbers/${type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Update HTML elements with fetched data
        document.getElementById('windowPrevState').innerHTML = `<strong>Previous Window State:</strong> ${data.windowPrevState.join(', ')}`;
        document.getElementById('windowCurrState').innerHTML = `<strong>Current Window State:</strong> ${data.windowCurrState.join(', ')}`;
        document.getElementById('numbers').innerHTML = `<strong>Fetched Numbers:</strong> ${data.numbers.join(', ')}`;
        document.getElementById('avg').innerHTML = `<strong>Average:</strong> ${data.avg}`;
    } catch (error) {
        console.error('Error fetching numbers:', error);
    }
});
