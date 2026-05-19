class AnimatedCake {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`未找到容器: ${containerId}`);
            return;
        }

        // 配置参数合并
        this.config = Object.assign({
            layers: 3, 
            layerHeight: 45,
            layerColor: '#8D5524', 
            fillingColor: '#FF9E9E',
            topFrostingColor: '#FDF5E6', 
            flowingFilling: true,
            plateColor: '#E0E0E0', 
            candleColor: '#FF6347',
            baseBottom: 35,
            greetingText: '生日快乐'
        }, options);

        this.baseBottom = this.config.baseBottom; 
        
        // 关键步骤：在构建 DOM 之前，先注入必需的 CSS 样式
        this.injectStyles();
        
        // 构建 DOM 结构
        this.buildDOM();
    }

    // 动态将 CSS 注入到页面头部
    injectStyles() {
        // 如果页面里已经注入过了，就不重复注入（防止实例化多个蛋糕时重复添加）
        if (document.getElementById('animated-cake-styles')) return;

        const style = document.createElement('style');
        style.id = 'animated-cake-styles';
        
        // 把所有的动画和基础样式写在这里
        style.textContent = `
            .cake-stage-container {
                position: relative;
                width: 340px;
                height: 500px;
                display: flex;
                justify-content: center;
                transform: scale(calc(min(1, 100vw / 360, 100vh / 600)));
                transform-origin: center center;
            }
            .cake-plate {
                position: absolute;
                bottom: 20px;
                width: 320px;
                height: 30px;
                border-radius: 50%;
                opacity: 0; 
            }
            .cake-layer-wrap {
                position: absolute;
                width: 260px;
                opacity: 0; 
            }
            .cake-sponge {
                width: 100%;
                height: 100%;
                border-radius: 4px; /* 轻微圆角 */
            }
            .cake-filling {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 15px;
                border-radius: 4px; /* 轻微圆角 */
                z-index: 2;
            }
            .drip {
                position: absolute;
                top: 10px; width: 16px;
                border-radius: 0 0 10px 10px;
                transform-origin: top;
                transform: scaleY(0);
            }
            .candle {
                position: absolute;
                width: 12px; height: 50px; border-radius: 3px;
                left: 50%; margin-left: -6px; opacity: 0;
            }
            .flame {
                position: absolute;
                top: -20px; left: 50%; margin-left: -7px;
                width: 14px; height: 20px;
                background: radial-gradient(ellipse at bottom, #FFD700 0%, #FF4500 100%);
                border-radius: 50% 50% 20% 20%; opacity: 0;
                transform-origin: bottom;
            }
            .greeting {
                position: absolute;
                bottom: -40px; color: #fff; font-size: 28px;
                font-weight: bold; letter-spacing: 2px; opacity: 0;
                white-space: nowrap;
            }
            @keyframes ac-fadeInSlideUp {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes ac-dropAndSquash {
                0% { transform: translateY(-400px) scaleY(1); opacity: 0; }
                50% { opacity: 1; }
                70% { transform: translateY(0) scaleY(1); }
                80% { transform: translateY(0) scaleY(0.85) scaleX(1.05); }
                90% { transform: translateY(0) scaleY(1.05) scaleX(0.98); }
                100% { transform: translateY(0) scaleY(1) scaleX(1); opacity: 1; }
            }
            @keyframes ac-flowDown {
                0% { transform: scaleY(0); }
                100% { transform: scaleY(1); }
            }
            @keyframes ac-flicker {
                0% { opacity: 0; transform: scale(0); }
                20% { opacity: 1; transform: scale(1.2); }
                100% { opacity: 0.9; transform: scale(1); }
            }
            @keyframes ac-pulseFlame {
                0%, 100% { transform: scale(1); opacity: 0.9; }
                50% { transform: scale(1.05); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    buildDOM() {
        this.container.classList.add('cake-stage-container');
        
        this.plateEl = document.createElement('div');
        this.plateEl.className = 'cake-plate';
        this.plateEl.style.backgroundColor = this.config.plateColor;
        this.container.appendChild(this.plateEl);

        this.layerEls = [];
        this.dripEls = [];

        for (let i = 0; i < this.config.layers; i++) {
            const layerWrap = document.createElement('div');
            layerWrap.className = 'cake-layer-wrap';
            layerWrap.style.height = `${this.config.layerHeight}px`;
            layerWrap.style.bottom = `${this.baseBottom + i * this.config.layerHeight}px`;
            layerWrap.style.zIndex = 10 + i;

            const sponge = document.createElement('div');
            sponge.className = 'cake-sponge';
            sponge.style.backgroundColor = this.config.layerColor;
            layerWrap.appendChild(sponge);

            const isTop = (i === this.config.layers - 1);
            const color = isTop ? this.config.topFrostingColor : this.config.fillingColor;
            
            const filling = document.createElement('div');
            filling.className = 'cake-filling';
            filling.style.backgroundColor = color;
            layerWrap.appendChild(filling);

            if (this.config.flowingFilling) {
                const dripCount = 5 + Math.floor(Math.random() * 3);
                for (let d = 0; d < dripCount; d++) {
                    const drip = document.createElement('div');
                    drip.className = 'drip';
                    drip.style.backgroundColor = color;
                    drip.style.left = `${5 + (d * (250 / dripCount)) + Math.random() * 15}px`;
                    drip.style.height = `${10 + Math.random() * 15}px`;
                    filling.appendChild(drip);
                    this.dripEls.push(drip);
                }
            }
            this.container.appendChild(layerWrap);
            this.layerEls.push(layerWrap);
        }

        const topY = this.baseBottom + this.config.layers * this.config.layerHeight;
        this.candleEl = document.createElement('div');
        this.candleEl.className = 'candle';
        this.candleEl.style.backgroundColor = this.config.candleColor;
        this.candleEl.style.bottom = `${topY}px`;
        this.candleEl.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px)';
        this.container.appendChild(this.candleEl);

        this.flameEl = document.createElement('div');
        this.flameEl.className = 'flame';
        this.candleEl.appendChild(this.flameEl);

        this.textEl = document.createElement('div');
        this.textEl.className = 'greeting';
        this.textEl.innerText = this.config.greetingText;
        this.container.appendChild(this.textEl);
    }

    play() {
        let currentTime = 0;
        this.plateEl.style.animation = `ac-fadeInSlideUp 0.6s ease-out forwards`;
        currentTime += 0.4; 

        this.layerEls.forEach((layer) => {
            layer.style.animation = `ac-dropAndSquash 0.8s forwards`;
            layer.style.animationDelay = `${currentTime}s`;
            currentTime += 0.25; 
        });

        currentTime += 0.2; 
        this.candleEl.style.animation = `ac-dropAndSquash 0.6s forwards`;
        this.candleEl.style.animationDelay = `${currentTime}s`;

        this.dripEls.forEach((drip) => {
            drip.style.animation = `ac-flowDown 0.8s ease-in-out forwards`;
            drip.style.animationDelay = `${currentTime + Math.random() * 0.4}s`;
        });

        currentTime += 0.8; 
        this.flameEl.style.animation = `ac-flicker 0.4s forwards, ac-pulseFlame 1.5s infinite alternate ease-in-out`;
        this.flameEl.style.animationDelay = `${currentTime}s, ${currentTime + 0.4}s`;

        currentTime += 0.5;
        this.textEl.style.animation = `ac-fadeInSlideUp 1s ease-out forwards`;
        this.textEl.style.animationDelay = `${currentTime}s`;
        
        return currentTime + 1; // 返回动画总时长
    }
}