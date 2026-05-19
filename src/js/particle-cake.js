const my3DCake = new ParticleCake('canvas-box', {
    text: '生日快乐!',
    particleCount: 15000
});

function handleInteraction() {
    // 移除所有事件监听器，防止重复触发
    document.body.removeEventListener('click', handleInteraction);
    document.body.removeEventListener('touchstart', handleInteraction);
    
    document.getElementById('tap-tip').style.display = 'none';
    my3DCake.explode();

    setTimeout(() => {
        document.getElementById('next-btn').classList.add('show');
    }, 2700);
}

// 同时监听 click 和 touchstart 事件，确保移动端也能正常触发
document.body.addEventListener('click', handleInteraction);
document.body.addEventListener('touchstart', handleInteraction, { passive: true });