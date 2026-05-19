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

const pictures = [
    {
        src: '../../pic/生成主播玩我的世界图片.png',
        title: '生日开场的第一张图',
        text: '把这张图放在最前面，像是在说：今天开始，所有好事都要排队进场。'
    },
    {
        src: '../../pic/efb3846fb0ba4fde04daff57df44e1c6.jpg',
        title: '一段值得记住的瞬间',
        text: '愿你在这些画面里，看到属于自己的笑容和一点点被认真喜欢的感觉。'
    },
    {
        src: '../../pic/ad2f99c702e0330ed1e77b9c24cacfbf.jpg',
        title: '生日的颜色',
        text: '照片里出现的色彩，就像生日这一天该有的明亮和热闹。'
    },
    {
        src: '../../pic/781e70454f4042e1a250644316145388.jpg',
        title: '回忆的中间页',
        text: '如果时间可以慢一点，希望这里的每一秒都能多停留一会儿。'
    },
    {
        src: '../../pic/5306cc146557e93720d019b37ce2e47c.jpg',
        title: '最后一张，留给祝福',
        text: '把最后一张留在这里，作为今天的收尾，也作为下一年的起点。'
    }
];

const gallery = document.getElementById('gallery');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

pictures.forEach((picture, index) => {
    const slide = document.createElement('section');
    slide.className = 'slide';
    slide.innerHTML = `
        <div class="photo-wrap">
            <img src="${picture.src}" alt="${picture.title}" loading="lazy">
        </div>
        <div class="caption">
            <h2>${index + 1}. ${picture.title}</h2>
            <p>${picture.text}</p>
        </div>
    `;
    gallery.appendChild(slide);
});

const slides = Array.from(gallery.querySelectorAll('.slide'));

function updateNavState() {
    const maxScroll = gallery.scrollWidth - gallery.clientWidth - 2;
    prevBtn.disabled = gallery.scrollLeft <= 2;
    nextBtn.disabled = gallery.scrollLeft >= maxScroll;
}

function scrollToSlide(direction) {
    const currentIndex = slides.findIndex((slide) => {
        const left = slide.offsetLeft;
        const right = left + slide.offsetWidth;
        const viewLeft = gallery.scrollLeft;
        const viewRight = viewLeft + gallery.clientWidth;
        return left >= viewLeft - 10 && right <= viewRight + 10;
    });

    const targetIndex = Math.max(0, Math.min(slides.length - 1, currentIndex + direction));
    slides[targetIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

prevBtn.addEventListener('click', () => scrollToSlide(-1));
nextBtn.addEventListener('click', () => scrollToSlide(1));
gallery.addEventListener('scroll', () => requestAnimationFrame(updateNavState), { passive: true });
window.addEventListener('resize', updateNavState);
updateNavState();