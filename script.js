let players = [];
let scores = []; // Array of arrays: [[P1_R1, P2_R1], [P1_R2, P2_R2], ...]
const SCORE_KEY = 'declareScorebookData';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    renderScoreboard();
});

function loadGameData() {
    const savedData = localStorage.getItem(SCORE_KEY);
    if (savedData) {
        const data = JSON.parse(savedData);
        players = data.players || [];
        scores = data.scores || [];
    }
}

function saveGameData() {
    const data = { players, scores };
    localStorage.setItem(SCORE_KEY, JSON.stringify(data));
}

// --- PLAYER MANAGEMENT ---
window.addPlayer = function() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        input.value = '';
        saveGameData();
        renderScoreboard();
    } else if (name) {
        alert("Player name already exists or is invalid.");
    }
}

window.clearScores = function() {
    if (confirm("Are you sure you want to start a new game? This will clear ALL players and scores.")) {
        players = [];
        scores = [];
        saveGameData();
        renderScoreboard();
    }
}

// --- SCORE LOGIC ---
window.addRoundScores = function() {
    const roundScores = [];
    let allValid = true;

    players.forEach((player, index) => {
        const input = document.getElementById(`score-input-${index}`);
        const score = parseInt(input.value.trim());

        if (isNaN(score) || score < 0) {
            alert(`Please enter a valid non-negative score for ${player}.`);
            allValid = false;
        }
        roundScores.push(score);
    });

    if (allValid) {
        scores.push(roundScores);
        saveGameData();
        renderScoreboard();
    }
}

// --- RENDERING ---
function renderScoreboard() {
    const table = document.getElementById('scoreTable');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    const tfoot = document.getElementById('totalRow');
    const scoreEntryDiv = document.getElementById('scoreEntry');
    const scoreInputsDiv = document.getElementById('playerScoreInputs');
    
    // Clear existing rows/columns
    thead.innerHTML = '<th>Round</th>';
    tbody.innerHTML = '';
    tfoot.innerHTML = '<td>Total</td>';
    scoreInputsDiv.innerHTML = '';
    
    if (players.length === 0) {
        scoreEntryDiv.style.display = 'none';
        return;
    }
    
    scoreEntryDiv.style.display = 'block';

    let totals = new Array(players.length).fill(0);

    // 1. Render Header (Player Names)
    players.forEach((player, index) => {
        const th = document.createElement('th');
        th.textContent = player;
        thead.appendChild(th);
        
        // Create score input fields for the next round
        scoreInputsDiv.innerHTML += `
            <div>
                <label>${player}:</label>
                <input type="number" id="score-input-${index}" min="0" value="0">
            </div>
        `;
    });

    // 2. Render Score Rows
    scores.forEach((roundScores, roundIndex) => {
        const tr = document.createElement('tr');
        // Round Number
        tr.innerHTML += `<td>${roundIndex + 1}</td>`;

        roundScores.forEach((score, playerIndex) => {
            tr.innerHTML += `<td>${score}</td>`;
            totals[playerIndex] += score;
        });
        tbody.appendChild(tr);
    });

    // 3. Render Totals Row
    let lowestTotal = Infinity;
    totals.forEach(total => {
        if (total < lowestTotal) {
            lowestTotal = total;
        }
    });

    totals.forEach(total => {
        const td = document.createElement('td');
        td.textContent = total;
        if (total === lowestTotal) {
            td.classList.add('winner');
        }
        tfoot.appendChild(td);
    });
    
    // Update Round Counter
    document.getElementById('currentRound').textContent = scores.length + 1;
}
