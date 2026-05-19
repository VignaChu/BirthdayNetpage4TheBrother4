# 🎂 生日祝福网页

为同学打造的生日庆祝静态网页，包含连连看小游戏、3D粒子蛋糕动画、回忆相册等有趣内容。

## ✨ 项目特色

- 🎮 **连连看小游戏** - 翻开卡片配对，完成后进入下一关
- 🎂 **2D蛋糕动画** - 精美的蛋糕掉落动画效果
- ✨ **3D粒子蛋糕** - Three.js实现的粒子蛋糕，点击触发烟花效果
- 📷 **回忆相册** - 展示生日照片的精美相册
- 💌 **生日贺卡** - 温馨的祝福页面
- 🎵 **背景音乐** - 可开关的生日背景音乐

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式与动画 |
| JavaScript | 交互逻辑 |
| Three.js | 3D粒子渲染 |

## 📁 项目结构

```
bro_happy_birthday/
├── pic/                    # 相册图片资源
│   └── *.jpg/png
├── src/
│   ├── audio/              # 音频资源
│   │   └── birthday.mp3    # 背景音乐
│   ├── css/                # 样式文件
│   │   ├── global.css      # 全局样式
│   │   ├── index.css       # 首页样式
│   │   ├── fall-cake.css   # 蛋糕动画样式
│   │   ├── card.css        # 贺卡页面样式
│   │   ├── particle-cake.css # 粒子蛋糕样式
│   │   ├── gallery.css     # 相册页面样式
│   │   └── ending.css      # 结语页面样式
│   ├── html/               # HTML页面
│   │   ├── card.html       # 生日贺卡
│   │   ├── ending.html     # 结语页面
│   │   ├── fall-cake.html  # 2D蛋糕动画
│   │   ├── gallery.html    # 回忆相册
│   │   └── particle-cake.html # 3D粒子蛋糕
│   └── js/                 # JavaScript文件
│       ├── AnimatedCake.js # 2D蛋糕动画类
│       ├── ParticleCake.js # 3D粒子蛋糕类
│       ├── fall-cake.js    # 蛋糕页面逻辑
│       ├── index.js        # 首页游戏逻辑
│       ├── card.js         # 贺卡页面逻辑
│       ├── ending.js       # 结语页面逻辑
│       ├── gallery.js      # 相册页面逻辑
│       └── particle-cake.js # 粒子蛋糕页面逻辑
├── index.html              # 首页（连连看游戏）
└── README.md               # 项目说明
```

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 支持 ES6+ 特性

### 运行方式

1. **克隆或下载项目**
   ```bash
   git clone <repository-url>
   cd bro_happy_birthday
   ```

2. **启动本地服务器**

   使用任意静态文件服务器即可，例如：

   ```bash
   # 使用 Python 3
   python -m http.server 8000

   # 或使用 Node.js
   npx serve .

   # 或使用 PHP
   php -S localhost:8000
   ```

3. **访问页面**

   在浏览器中打开 `http://localhost:8000` 即可开始体验。

## 🎮 页面说明

| 页面 | 说明 | 入口 |
|------|------|------|
| 首页 | 连连看小游戏 | `index.html` |
| 蛋糕动画 | 2D蛋糕掉落动画 | `src/html/fall-cake.html` |
| 贺卡 | 生日祝福贺卡 | `src/html/card.html` |
| 粒子蛋糕 | 3D粒子蛋糕烟花效果 | `src/html/particle-cake.html` |
| 相册 | 回忆照片相册 | `src/html/gallery.html` |
| 结语 | 祝福结语 | `src/html/ending.html` |

## 📄 开源协议

本项目基于 MIT 协议开源。

## 🙏 致谢

- [Three.js](https://threejs.org/) - 3D图形库

---

🎂 生日快乐！愿每一年都闪闪发光！