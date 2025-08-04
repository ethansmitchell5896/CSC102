// JARVIS AI Slot Machine Game JavaScript
// Handles spinning animation and game logic

// -- INITIALIZATION --

// Jarvis/AI themed slot symbols
const slotSymbols = ['⚡', '🔧', '💎', '🔋', '⚙️', '◈'];

// Starting energy credits
let playerBalance = 10000;

// DOM references (must match HTML IDs)
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const slotResults = document.getElementById('slotResults');
const balanceDisplay = document.getElementById('balance');
const messageBox = document.getElementById('messages');
const gameForm = document.getElementById('gameForm');
const betInput = document.getElementById('betAmount');

// Immediately show starting balance
balanceDisplay.innerHTML = playerBalance.toLocaleString();

// Handles form submission (no event listeners in HTML)
gameForm.onsubmit = function(event) {
    event.preventDefault(); // Prevent reload

    let bet = parseInt(betInput.value);

    // Validation for input
    if (isNaN(bet) || bet < 1 || bet > 100000) {
        messageBox.innerHTML = 'INVALID INPUT: Enter valid energy credits between 1 and 100000.';
        return;
    }
    if (bet > playerBalance) {
        messageBox.innerHTML = "INSUFFICIENT ENERGY: Not enough credits for this quantum calculation!";
        return;
    }

    animateSpin(bet); // New function for reel animation and result
};

// Animates slot spinning before showing results
function animateSpin(bet) {
    const iterations = 20;              // Total animation frames
    const spinSpeed = 125;              // ms between frame changes
    let count = 0;

    // Save target (random) results
    const r1 = Math.floor(Math.random() * slotSymbols.length);
    const r2 = Math.floor(Math.random() * slotSymbols.length);
    const r3 = Math.floor(Math.random() * slotSymbols.length);

    // Disable input while spinning
    betInput.disabled = true;
    slotResults.innerHTML = "⟳ Spinning quantum reels ⟳";
    messageBox.innerHTML = "Calculating quantum probabilities...";

    // Do the animation: rapid reel changes
    let spinInterval = setInterval(() => {
        reel1.innerHTML = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        reel2.innerHTML = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        reel3.innerHTML = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        count++;
        // End animation after set frames
        if (count > iterations) {
            clearInterval(spinInterval);
            showResult(bet, [r1, r2, r3]);
            betInput.disabled = false;
        }
    }, spinSpeed);
}

// Process the outcome after spinning
function showResult(bet, idxs) {
    playerBalance -= bet;
    // Show final random symbols
    reel1.innerHTML = slotSymbols[idxs[0]];
    reel2.innerHTML = slotSymbols[idxs[1]];
    reel3.innerHTML = slotSymbols[idxs[2]];
    const results = [slotSymbols[idxs[0]], slotSymbols[idxs[1]], slotSymbols[idxs[2]]];

    // Calculate payout and feedback
    const prize = calculatePrize(results, bet);
    if (prize > 0) {
        playerBalance += prize;
        slotResults.innerHTML = `⚡ QUANTUM SUCCESS! Energy gained: ${prize} credits!`;
        messageBox.innerHTML = getOutcomeMessage(results, prize, bet);
    } else {
        slotResults.innerHTML = 'Quantum calculation failed. Recalibrating...';
        messageBox.innerHTML = getOutcomeMessage(results, 0, bet);
    }
    balanceDisplay.innerHTML = playerBalance.toLocaleString();

    // Optional: Shut off input if broke
    if (playerBalance === 0) {
        messageBox.innerHTML = "AI SYSTEM LOCKDOWN: Out of energy. Reboot to recharge.";
        betInput.disabled = true;
    }
}

// Returns the payout according to Jarvis slot rules
function calculatePrize(results, bet) {
    const counts = {};
    results.forEach(symbol => counts[symbol] = (counts[symbol] || 0) + 1);
    // 10x for three of any kind
    if (counts[results[0]] === 3) return bet * 10;
    // 3x for two '🔧'
    if (counts['🔧'] === 2) return Math.floor(bet * 3);
    // 2x for two '💎'
    if (counts['💎'] === 2) return Math.floor(bet * 2);
    // 1.5x for any other pair
    for (let sym in counts) if (counts[sym] === 2 && sym !== '🔧' && sym !== '💎') return Math.floor(bet * 1.5);
    return 0;
}

// UX message based on outcome
function getOutcomeMessage(results, winnings, bet) {
    if (!winnings) return `Quantum Failure! 🤖<br> Energy credits lost: ${bet}<br>Slot outcome: ${results.join(' ')}`;
    if (winnings === bet * 10) return `TRIPLE SYNCHRONIZATION! 🤖<br> All ${results[0]} for 10x quantum boost!`;
    if (winnings === Math.floor(bet * 3)) return `Dual Tech Surge! 🤖<br> Double '🔧' - System efficiency tripled.`;
    if (winnings === Math.floor(bet * 2)) return `Quantum Amplification! 🤖<br> Double '💎' - Energy doubled.`;
    if (winnings === Math.floor(bet * 1.5)) return `Dual Match! 🤖<br> Quantum system enhanced 1.5x.`;
    return `QUANTUM SURGE: +${winnings} credits. 🤖`;
}