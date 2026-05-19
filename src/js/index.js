const board = document.getElementById('board');
const stepsEl = document.getElementById('steps');
const matchedEl = document.getElementById('matched');
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');
const overlay = document.getElementById('overlay');
const finalText = document.getElementById('final-text');
const restartBtn = document.getElementById('restart');
const playAgainBtn = document.getElementById('play-again');
const musicToggleBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

const pairs = [
    { icon: '🎂', name: '生日蛋糕' },
    { icon: '🍰', name: '蛋糕切片' },
    { icon: '🎁', name: '礼物盒' },
    { icon: '🎈', name: '气球' },
    { icon: '🕯️', name: '蜡烛' },
    { icon: '🎉', name: '彩带' },
    { icon: '🎊', name: '礼花' },
    { icon: '🥳', name: '庆祝' }
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let stepCount = 0;
const totalPairs = pairs.length;
let autoTimer = null;
let musicStarted = false;

function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function updateHud() {
    stepsEl.textContent = String(stepCount);
    matchedEl.textContent = String(matchedCount);
    progressEl.style.width = `${(matchedCount / totalPairs) * 100}%`;
}

function finishLevel(message, autoDelay = 1400) {
    clearTimeout(autoTimer);
    finalText.textContent = message;
    overlay.classList.add('show');
    autoTimer = setTimeout(goNext, autoDelay);
}

function goNext() {
    window.location.href = 'src/html/fall-cake.html';
}

function playMusic() {
    bgMusic.play().then(() => {
        musicStarted = true;
        musicToggleBtn.classList.add('active');
    }).catch((error) => {
        console.warn('背景音乐未能播放。', error);
    });
}

function toggleMusic() {
    if (bgMusic.paused) {
        playMusic();
        return;
    }

    bgMusic.pause();
    musicStarted = false;
    musicToggleBtn.classList.remove('active');
}

function buildBoard() {
    clearTimeout(autoTimer);
    board.innerHTML = '';
    const deck = shuffle([...pairs, ...pairs]);
    deck.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'card';
        button.dataset.icon = item.icon;
        button.dataset.name = item.name;
        button.setAttribute('aria-label', `卡片：${item.name}`);
        button.innerHTML = `
            <div class="inner">
                <div class="face front"></div>
                <div class="face back">${item.icon}</div>
            </div>
        `;
        button.addEventListener('click', () => handleFlip(button));
        board.appendChild(button);
    });

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedCount = 0;
    stepCount = 0;
    overlay.classList.remove('show');
    statusEl.textContent = '开始翻牌吧。';
    finalText.textContent = '';
    updateHud();
}

function clearSelection() {
    if (firstCard) firstCard.classList.remove('flipped');
    if (secondCard) secondCard.classList.remove('flipped');
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function matchCards(cardA, cardB) {
    cardA.classList.add('matched');
    cardB.classList.add('matched');
    cardA.disabled = true;
    cardB.disabled = true;
    matchedCount += 1;
    statusEl.innerHTML = `配对成功：<span class="matched-hint">${cardA.dataset.name}</span> 亮起来了。`;
    updateHud();

    if (matchedCount === totalPairs) {
        finishLevel(`你用 ${stepCount} 步完成了全部配对。下一关已经解锁。`);
    }
}

function handleFlip(card) {
    if (lockBoard || card.disabled || card === firstCard) return;
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    stepCount += 1;
    updateHud();
    lockBoard = true;

    const firstPicked = firstCard;
    const secondPicked = secondCard;
    const isMatch = firstPicked.dataset.icon === secondPicked.dataset.icon;
    if (isMatch) {
        setTimeout(() => matchCards(firstPicked, secondPicked), 260);
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    } else {
        statusEl.textContent = '没配对上，记住位置再来一次。';
        setTimeout(() => {
            clearSelection();
        }, 700);
    }
}

restartBtn.addEventListener('click', buildBoard);
playAgainBtn.addEventListener('click', buildBoard);
musicToggleBtn.addEventListener('click', toggleMusic);
bgMusic.addEventListener('play', () => {
    musicStarted = true;
    musicToggleBtn.classList.add('active');
});
bgMusic.addEventListener('pause', () => {
    musicStarted = false;
    musicToggleBtn.classList.remove('active');
});
buildBoard();
