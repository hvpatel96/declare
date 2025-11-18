let players = [];
let scores = [];
let isGameOver = false;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderScoreboard();
});

// --- PLAYER MANAGEMENT ---
window.addPlayer = function() {
    if (isGameOver) {
        alert("Game over! Please start a new game to add players.");
        return;
    }
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        input.value = '';
        renderScoreboard();
    } else if (name) {
        alert("Player name already exists or is invalid.");
    }
}

window.clearScores = function() {
    if (confirm("Are you sure you want to start a new game? This will clear ALL players and scores.")) {
        players = [];
        scores = [];
        isGameOver = false; // Reset game state
        renderScoreboard();
        document.getElementById('playerNameInput').value = '';
        document.getElementById('playerScoreInputs').innerHTML = '';
    }
}

// --- SCORE LOGIC ---
window.addRoundScores = function() {
    if (isGameOver) {
        alert("The game has ended. Start a new game to enter scores.");
        return;
    }
    
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
        renderScoreboard();
        players.forEach((player, index) => {
            document.getElementById(`score-input-${index}`).value = 0;
        });
    }
}

// END GAME FUNCTION
window.endGame = function() {
    if (players.length === 0) {
        alert("You must add players before ending the game.");
        return;
    }
    if (scores.length === 0) {
        alert("At least one round must be played before ending the game.");
        return;
    }
    if (confirm("Are you sure you want to end the game? Scores will be finalized and no more rounds can be added.")) {
        isGameOver = true;
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
    const endGameButton = document.getElementById('endGameButton');
    
    // Clear existing rows/columns
    thead.innerHTML = '<th>Round</th>';
    tbody.innerHTML = '';
    tfoot.innerHTML = '<td>Total</td>';
    scoreInputsDiv.innerHTML = '';
    
    // Hide/Show score entry based on game state
    if (players.length === 0 || isGameOver) {
        scoreEntryDiv.style.display = 'none';
        endGameButton.style.display = 'none';
    } else {
        scoreEntryDiv.style.display = 'block';
        endGameButton.style.display = 'inline-block';
    }

    if (players.length === 0) return;

    let totals = new Array(players.length).fill(0);

    // 1. Render Header and Inputs
    players.forEach((player, index) => {
        const th = document.createElement('th');
        th.textContent = player;
        thead.appendChild(th);
        
        if (!isGameOver) {
            scoreInputsDiv.innerHTML += `
                <div>
                    <label>${player}:</label>
                    <input type="number" id="score-input-${index}" min="0" value="0">
                </div>
            `;
        }
    });

    // 2. Render Score Rows
    scores.forEach((roundScores, roundIndex) => {
        const tr = document.createElement('tr');
        tr.innerHTML += `<td>${roundIndex + 1}</td>`;

        roundScores.forEach((score, playerIndex) => {
            tr.innerHTML += `<td>${score}</td>`;
            totals[playerIndex] += score;
        });
        tbody.appendChild(tr);
    });

    // 3. Render Totals Row & Highlight Logic (REVISED)
    let lowestTotal = Infinity;
    let highestTotal = -1; // Initialize for finding the highest score

    // Find the min and max totals
    totals.forEach(total => {
        if (total < lowestTotal) lowestTotal = total;
        if (total > highestTotal) highestTotal = total;
    });

    // Apply colors
    totals.forEach(total => {
        const td = document.createElement('td');
        td.textContent = total;
        
        // Always highlight the lowest total (current leader) if scores exist
        if (scores.length > 0 && total === lowestTotal) {
            td.classList.add('winner');
        }
        
        // Highlight the highest total (current loser)
        // Only apply if the highest score is NOT the same as the lowest score
        if (scores.length > 0 && total === highestTotal && highestTotal !== lowestTotal) {
            td.classList.add('loser');
        }

        tfoot.appendChild(td);
    });
    
    // Update Round Counter
    document.getElementById('currentRound').textContent = scores.length + 1;
}
