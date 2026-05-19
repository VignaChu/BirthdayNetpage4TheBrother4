const my3DCake = new ParticleCake('canvas-box', {
    text: '生日快乐!',
    particleCount: 15000
});

document.body.addEventListener('click', () => {
    document.getElementById('tap-tip').style.display = 'none';
    my3DCake.explode();

    setTimeout(() => {
        document.getElementById('next-btn').classList.add('show');
    }, 2700);
}, { once: true });