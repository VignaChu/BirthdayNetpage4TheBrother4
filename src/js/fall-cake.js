const particleLayer = document.getElementById('particle-layer');

function createBox() {
    const box = document.createElement('div');
    box.className = 'float-box';

    const size = Math.random() * 90 + 24;
    box.style.width = `${size}px`;
    box.style.height = `${size}px`;
    box.style.left = `${Math.random() * 100}vw`;
    box.style.animationDuration = `${Math.random() * 12 + 8}s`;
    box.style.animationDelay = `${Math.random() * 12}s`;
    box.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.style.background = `rgba(255, 255, 255, ${Math.random() * 0.18 + 0.08})`;

    particleLayer.appendChild(box);
    setTimeout(() => box.remove(), 22000);
}

for (let i = 0; i < 18; i++) {
    createBox();
    const box = particleLayer.lastElementChild;
    if (box) {
        box.style.animationDelay = `-${Math.random() * 18}s`;
    }
}

setInterval(createBox, 850);

const myCake = new AnimatedCake('cake-box', {
    layers: 4,
    layerColor: '#F5DEB3',
    fillingColor: '#FF69B4',
    topFrostingColor: '#FFFFFF',
    greetingText: 'Happy Birthday!'
});

const cakeBox = document.getElementById('cake-box');
const continueHint = document.getElementById('continue-hint');

cakeBox.addEventListener('click', () => {
    document.getElementById('tap-tip').style.display = 'none';
    const totalTime = myCake.play();
    setTimeout(() => {
        continueHint.classList.add('show');
    }, Math.max(0, (totalTime * 1000) - 500));
    setTimeout(() => {
        window.location.href = 'card.html';
    }, (totalTime * 1000) + 1200);
}, { once: true });
