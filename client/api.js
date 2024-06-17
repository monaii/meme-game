export async function login(username, password) {
    const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

export async function logout() {
    await fetch('http://localhost:3001/api/logout', {
        method: 'POST'
    });
}

export async function getMemes() {
    const response = await fetch('http://localhost:3001/api/memes');
    const data = await response.json();
    return data;
}

export async function getCaptions() {
    const response = await fetch('http://localhost:3001/api/captions');
    const data = await response.json();
    return data;
}

export async function saveGameResult(result) {
    await fetch('http://localhost:3001/api/saveGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    });
}

export async function getGameHistory() {
    const response = await fetch('http://localhost:3001/api/gameHistory');
    const data = await response.json();
    return data;
}
