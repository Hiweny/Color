# 色 · Gradient Gallery

一个简洁优雅的渐变配色展示网站 —— 随机展示、收藏、从图片提取配色。

纯前端实现（HTML + CSS + JS），无任何依赖，可直接部署到 GitHub Pages / 任意静态托管。

## 功能

- **随机展示**：智能随机算法（互补 / 三角 / 邻近 / 日落 / 极光 / 单色等配色模式）+ webgradients 180 组手工精选渐变基底，始终产出和谐优雅的渐变
- **动态效果**：渐变几何图形流动动画、星星✨闪烁点缀、随机切换交叉渐隐
- **中文诗意命名**：每个配色自动生成类似「暮霭黛」「星野粉」「初雪蓝」的中文诗意名称，每个颜色也有「丹粉」「浅青」「砚灰」等传统色名
- **收藏**：一键收藏喜欢的配色，localStorage 持久化保存，可随时查看
- **图片提色**：上传任意图片，前端 Canvas 读像素 + K-means 聚类，提取 5 个主色并自动生成渐变（参考 vibecolor 的实现思路，纯客户端完成，不上传图片）
- **复制 CSS**：一键复制 `linear-gradient()` 代码，方便直接用于设计
- **快捷键**：空格 = 随机刷新，Esc = 关闭上传面板

## 配色来源（三种，细致可追溯）

| 来源 | 说明 |
|---|---|
| `assets/data/gradients.js` | webgradients 项目 180 组手工精选渐变（github.com/itmeo/webgradients，MIT License），作为手工基底 |
| 智能随机生成 | 在 HSL 空间按黄金角取色相，多种配色模式随机组合，保证任意两次随机都和谐 |
| 图片提取 | Canvas 抽样 + K-means 聚类（k=5），按亮度排序、去重、微调饱和度后输出 |

## 使用

```bash
# 本地预览
python3 -m http.server 8765
# 打开 http://localhost:8765
```

或直接将本目录内容推送到 GitHub Pages 仓库即可上线。

## 项目结构

```
color/
├── index.html            # 页面骨架
├── assets/
│   ├── style.css         # 视觉样式（深色高级感 + 玻璃拟态 + 星群动效）
│   ├── app.js            # 全部逻辑（随机/命名/收藏/提色/动效）
│   └── data/
│       └── gradients.js  # webgradients 180 组渐变数据
└── README.md
```

## 致谢

- 渐变基底数据来自 [itmeo/webgradients](https://github.com/itmeo/webgradients)（MIT License）
- 设计灵感参考 [vibecolor.ai](https://vibecolor.ai/) 的诗意色卡风格
