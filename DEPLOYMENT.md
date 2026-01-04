# 部署指南 - Flow System

## 🚀 Vercel 部署（推荐）

### 方法 1: 通过 GitHub（最简单）

1. **推送代码到 GitHub**
   ```bash
   git push origin claude/flow-system-design-EnmrO
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库: `themovingdot/Waterflow`
   - 选择分支: `claude/flow-system-design-EnmrO`

3. **配置项目**

   Vercel 会自动检测到 Next.js 项目，但需要设置根目录：

   **Root Directory**: `flow-system`

   其他设置保持默认：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **部署**

   点击 "Deploy" 按钮，等待几分钟即可完成！

5. **访问**

   部署完成后，Vercel 会给你一个 URL，例如：
   ```
   https://waterflow-xxx.vercel.app
   ```

### 方法 2: 使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   cd /home/user/Waterflow
   vercel
   ```

   按提示回答问题：
   - Set up and deploy? **Y**
   - Which scope? 选择你的账户
   - Link to existing project? **N**
   - What's your project's name? **waterflow** 或任意名称
   - In which directory is your code located? **./flow-system**

4. **生产部署**
   ```bash
   vercel --prod
   ```

### 方法 3: 从项目目录部署

如果 Vercel 无法自动检测配置：

1. **进入项目目录**
   ```bash
   cd flow-system
   ```

2. **部署**
   ```bash
   vercel
   ```

3. **生产部署**
   ```bash
   vercel --prod
   ```

---

## ⚙️ 环境变量（可选）

目前项目不需要环境变量，但如果未来需要，在 Vercel 项目设置中添加：

```
Settings → Environment Variables
```

---

## 🔄 自动部署

设置好 GitHub 集成后，每次推送到指定分支都会自动触发部署：

- Push to `claude/flow-system-design-EnmrO` → 自动部署预览
- Merge to `main` → 自动部署到生产环境

---

## 📝 部署清单

在部署前确认：

- [x] 项目构建成功 (`npm run build`)
- [x] 所有依赖已安装
- [x] Tailwind CSS v4 PostCSS 配置正确
- [x] Git 仓库已推送到远程
- [x] 选择正确的分支部署

---

## 🐛 常见问题

### 构建失败：Tailwind CSS 错误

**错误信息：**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**解决方案：**
确保已安装 `@tailwindcss/postcss` 并更新 `postcss.config.js`：

```bash
npm install -D @tailwindcss/postcss
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 404 错误

**问题：** 部署后访问出现 404

**解决方案：**
- 检查 Root Directory 是否设置为 `flow-system`
- 确认 build 输出目录正确

### 样式丢失

**问题：** 部署后样式没有加载

**解决方案：**
- 清除 Vercel 缓存重新部署
- 检查 `app/globals.css` 是否正确导入

---

## 🎯 部署后验证

访问部署的 URL，确认：

1. ✅ 页面正常加载
2. ✅ 样式完整显示（米白背景 + 蓝色主题）
3. ✅ 节点可以点击展开
4. ✅ 键盘快捷键正常工作
5. ✅ 流动粒子动画播放
6. ✅ MiniMap 和 Controls 显示

---

## 📊 性能优化（可选）

部署后可以启用 Vercel 的优化功能：

- **Analytics**: 监控页面性能
- **Speed Insights**: 查看 Core Web Vitals
- **Image Optimization**: 自动优化图片（如果添加图片）

在 Vercel 项目设置中启用这些功能。

---

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

---

部署完成后，请分享你的 URL！🎉
