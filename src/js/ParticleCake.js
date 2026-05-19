class ParticleCake {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`未找到容器: ${containerId}`);
            return;
        }

        // 根据屏幕尺寸动态计算配置
        this.isMobile = window.innerWidth < 768;
        const screenRatio = Math.min(window.innerWidth, window.innerHeight) / Math.max(window.innerWidth, window.innerHeight);
        
        // 默认配置与用户配置合并
        this.config = Object.assign({
            text: '生日快乐',         // 最终显示的文字
            particleCount: this.isMobile ? 8000 : 15000,    // 移动端减少粒子数量
            particleSize: this.isMobile ? 2 : 3,            // 移动端减小粒子大小
            textSize: this.isMobile ? 80 : 150,             // 移动端减小文字大小
            fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif', // 字体
            candleColor: '#FFFF00',   // 蜡烛颜色 (默认黄色)
            cameraZ: this.isMobile ? 320 : 400,            // 移动端相机更近
            textScale: this.isMobile ? 0.9 : 1.2           // 移动端文字缩放
        }, options);

        // 状态机
        this.currentState = 'CAKE'; // CAKE -> FIREWORK -> TEXT
        this.fireworkStartTime = 0;
        this.time = 0; // 用于火苗闪烁动画

        // 初始化数据数组
        const pCount = this.config.particleCount;
        this.positions = new Float32Array(pCount * 3);
        this.targetPositions = new Float32Array(pCount * 3);
        this.velocities = new Float32Array(pCount * 3);
        this.colors = new Float32Array(pCount * 3);
        this.types = new Float32Array(pCount); // 标记粒子类型 (0: cake, 1: candle, 2: flame)
        
        this.colorObj = new THREE.Color();

        // 绑定 this 上下文
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.init();
    }

    init() {
        // 1. 初始化场景、相机、渲染器
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050510, 0.002);

        this.camera = new THREE.PerspectiveCamera(this.isMobile ? 70 : 60, this.container.clientWidth / this.container.clientHeight, 1, 2000);
        this.camera.position.set(0, this.isMobile ? 80 : 100, this.config.cameraZ);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // 2. 初始化粒子几何体
        this.geometry = new THREE.BufferGeometry();
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;
            this.positions[i3] = (Math.random() - 0.5) * 1000;
            this.positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            this.positions[i3 + 2] = (Math.random() - 0.5) * 1000;
            this.colors[i3] = 1; this.colors[i3 + 1] = 1; this.colors[i3 + 2] = 1;
            this.types[i] = 0; // 默认都是蛋糕胚子
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        this.geometry.setAttribute('type', new THREE.BufferAttribute(this.types, 1)); // 添加类型属性

        const material = new THREE.PointsMaterial({
            size: this.config.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending // 粒子叠加更亮，适合背景和火苗
        });

        this.particles = new THREE.Points(this.geometry, material);
        this.scene.add(this.particles);

        // 3. 事件监听
        window.addEventListener('resize', this.onWindowResize);

        // 4. 生成初始形态并启动动画
        this.generateCake();
        this.animate();
    }

    // 辅助方法：生成数学上的严格圆柱体坐标
    createCylinderPoints(count, radius, height, targetPosArray, colorArray, startIndex, hslColor, baseHeight, typesArray, particleType) {
        for (let i = 0; i < count; i++) {
            const index = startIndex + i;
            const index3 = index * 3;
            
            // 使用极坐标生成圆柱体内的点
            const r = Math.sqrt(Math.random()) * radius; 
            const theta = Math.random() * Math.PI * 2;
            const h = Math.random() * height + baseHeight; 
            
            targetPosArray[index3] = r * Math.cos(theta); // x
            targetPosArray[index3 + 1] = h; // y
            targetPosArray[index3 + 2] = r * Math.sin(theta); // z

            if (hslColor) {
                this.colorObj.setHSL(hslColor.h, hslColor.s, hslColor.l);
            } else {
                this.colorObj.setHSL(0.1 + Math.random() * 0.05, 0.8, 0.6); // 默认暖黄色蛋糕胚
            }
            
            colorArray[index3] = this.colorObj.r;
            colorArray[index3 + 1] = this.colorObj.g;
            colorArray[index3 + 2] = this.colorObj.b;

            typesArray[index] = particleType; // 标记粒子类型
        }
    }

    generateCake() {
        this.currentState = 'CAKE';
        const pCount = this.config.particleCount;

        // 粒子划分
        const cakeCount = Math.floor(pCount * 0.85); // 85% 做胚子
        const candleCount = Math.floor(pCount * 0.10); // 10% 做蜡烛
        const flameCount = pCount - cakeCount - candleCount; // 剩下 5% 做火苗

        // 移动端缩小蛋糕尺寸
        const scale = this.isMobile ? 0.75 : 1;

        let currentIndex = 0;

        // 1. 生成挺拔的圆柱体蛋糕胚子
        const cakeRadius = 100 * scale;
        const cakeHeight = 100 * scale;
        const cakeBaseY = -50 * scale;
        this.createCylinderPoints(cakeCount, cakeRadius, cakeHeight, this.targetPositions, this.colors, currentIndex, null, cakeBaseY, this.types, 0);
        currentIndex += cakeCount;

        // 2. 生成蜡烛 (彩色的直柱子)
        const candleRadius = 8 * scale;
        const candleHeight = 60 * scale;
        const candleBaseY = cakeBaseY + cakeHeight; // 蜡烛在蛋糕顶上
        
        // 将十六进制颜色转换为HSL
        this.colorObj.set(this.config.candleColor);
        const candleHsl = {};
        this.colorObj.getHSL(candleHsl);
        this.createCylinderPoints(candleCount, candleRadius, candleHeight, this.targetPositions, this.colors, currentIndex, candleHsl, candleBaseY, this.types, 1);
        currentIndex += candleCount;

        // 3. 生成一小簇火苗 (在蜡烛顶端)
        const flameRadius = 6 * scale;
        const flameHeight = 15 * scale;
        const flameBaseY = candleBaseY + candleHeight;
        const flameHsl = {h: 0.03, s: 1.0, l: 0.6}; // 火热的橙红色
        this.createCylinderPoints(flameCount, flameRadius, flameHeight, this.targetPositions, this.colors, currentIndex, flameHsl, flameBaseY, this.types, 2);
        
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.type.needsUpdate = true;
    }

    // 触发烟花爆发
    explode() {
        if (this.currentState === 'FIREWORK') return;
        this.currentState = 'FIREWORK';
        this.fireworkStartTime = Date.now();
        const pCount = this.config.particleCount;

        for (let i = 0; i < pCount; i++) {
            const i3 = i * 3;
            // 球坐标随机发散生成速度
            const u = Math.random(); 
            const v = Math.random();
            const theta = 2 * Math.PI * u; 
            const phi = Math.acos(2 * v - 1);
            const speed = 2 + Math.random() * 8;
            
            this.velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed; 
            this.velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            this.velocities[i3 + 2] = Math.cos(phi) * speed;

            // 烟花随机彩色
            this.colorObj.setHSL(Math.random(), 1.0, 0.6);
            this.colors[i3] = this.colorObj.r; 
            this.colors[i3 + 1] = this.colorObj.g; 
            this.colors[i3 + 2] = this.colorObj.b;
        }
        this.geometry.attributes.color.needsUpdate = true;
    }

    // 动态提取文字坐标
    generateText() {
        const canvasWidth = this.isMobile ? 500 : 800;
        const canvasHeight = this.isMobile ? 280 : 400;
        
        const canvas2d = document.createElement('canvas');
        canvas2d.width = canvasWidth;
        canvas2d.height = canvasHeight;
        const ctx = canvas2d.getContext('2d');
        
        ctx.font = `bold ${this.config.textSize}px ${this.config.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.config.text, canvas2d.width / 2, canvas2d.height / 2);

        const imgData = ctx.getImageData(0, 0, canvas2d.width, canvas2d.height).data;
        const validPixels = [];

        // 根据设备调整采样间隔
        const step = this.isMobile ? 2 : 3;
        for (let y = 0; y < canvas2d.height; y += step) {
            for (let x = 0; x < canvas2d.width; x += step) {
                const index = (y * canvas2d.width + x) * 4;
                if (imgData[index + 3] > 128) {
                    validPixels.push({
                        x: x - canvas2d.width / 2,
                        y: -(y - canvas2d.height / 2)
                    });
                }
            }
        }

        const pCount = this.config.particleCount;
        const validCount = validPixels.length;
        const scale = this.config.textScale;
        
        for (let i = 0; i < pCount; i++) {
            const i3 = i * 3;
            // 如果粒子多于像素，循环复用像素点
            const targetPixel = validPixels[i % validCount]; 
            
            this.targetPositions[i3] = targetPixel.x * scale;
            this.targetPositions[i3 + 1] = targetPixel.y * scale;
            this.targetPositions[i3 + 2] = (Math.random() - 0.5) * (this.isMobile ? 10 : 20);
        }
    }

    // 渲染循环
    animate() {
        requestAnimationFrame(this.animate);
        this.time += 0.016; 

        const positionsAttr = this.geometry.attributes.position.array;
        const typesAttr = this.geometry.attributes.type.array;
        const colorsAttr = this.geometry.attributes.color.array;
        const pCount = this.config.particleCount;

        if (this.currentState === 'CAKE') {
            this.particles.rotation.y += 0.005; // 整体缓慢旋转
            
            for (let i = 0; i < pCount; i++) {
                const i3 = i * 3;
                const type = typesAttr[i];
                
                if (type === 2) { 
                    // 火苗粒子要闪烁
                    positionsAttr[i3] += (this.targetPositions[i3] - positionsAttr[i3]) * 0.05;
                    positionsAttr[i3+1] += (this.targetPositions[i3+1] - positionsAttr[i3+1]) * 0.05;
                    positionsAttr[i3+2] += (this.targetPositions[i3+2] - positionsAttr[i3+2]) * 0.05;
                    
                    // 细微闪动
                    positionsAttr[i3] += (Math.random() - 0.5) * 1.5; 
                    positionsAttr[i3 + 1] += (Math.random() - 0.2) * 2; 
                    positionsAttr[i3 + 2] += (Math.random() - 0.5) * 1.5; 
                    
                    // 呼吸发亮
                    const luminosity = 0.5 + Math.sin(this.time * 20 + i * 0.1) * 0.1; 
                    this.colorObj.setHSL(0.03, 1.0, luminosity);
                    colorsAttr[i3] = this.colorObj.r; 
                    colorsAttr[i3+1] = this.colorObj.g; 
                    colorsAttr[i3+2] = this.colorObj.b;

                } else {
                    // 普通蛋糕和蜡烛粒子平滑移动
                    positionsAttr[i3] += (this.targetPositions[i3] - positionsAttr[i3]) * 0.05;
                    positionsAttr[i3 + 1] += (this.targetPositions[i3 + 1] - positionsAttr[i3 + 1]) * 0.05;
                    positionsAttr[i3 + 2] += (this.targetPositions[i3 + 2] - positionsAttr[i3 + 2]) * 0.05;
                }
            }
            this.geometry.attributes.color.needsUpdate = true;

        } else if (this.currentState === 'FIREWORK') {
            this.particles.rotation.y = 0; 
            
            // 2.5 秒后自动变成文字
            if (Date.now() - this.fireworkStartTime > 2000) {
                this.currentState = 'TEXT';
                this.generateText();
            } else {
                for (let i = 0; i < pCount; i++) {
                    const i3 = i * 3;
                    this.velocities[i3 + 1] -= 0.05; // 重力
                    this.velocities[i3] *= 0.96;     // 摩擦力
                    this.velocities[i3 + 1] *= 0.96;
                    this.velocities[i3 + 2] *= 0.96;

                    positionsAttr[i3] += this.velocities[i3];
                    positionsAttr[i3 + 1] += this.velocities[i3 + 1];
                    positionsAttr[i3 + 2] += this.velocities[i3 + 2];
                }
            }
        } else if (this.currentState === 'TEXT') {
            // 平滑移动变成文字
            for (let i = 0; i < pCount * 3; i++) {
                positionsAttr[i] += (this.targetPositions[i] - positionsAttr[i]) * 0.08;
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}