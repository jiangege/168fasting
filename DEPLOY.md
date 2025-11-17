# 168 断食追踪

16:8 间歇性断食追踪应用

## 部署到 GitHub Pages

### 方法一：使用 GitHub Actions 自动部署（推荐）

1. **将代码推送到 GitHub**
   ```bash
   git add .
   git commit -m "配置 GitHub Pages 部署"
   git push origin main
   ```

2. **在 GitHub 仓库设置中启用 GitHub Pages**
   - 进入仓库的 Settings > Pages
   - Source 选择 "GitHub Actions"
   - 保存设置

3. **触发部署**
   - 每次推送到 `main` 分支时会自动触发部署
   - 部署完成后，访问 `https://你的用户名.github.io/168fasting/`

### 方法二：使用 gh-pages 手动部署

1. **安装依赖**
   ```bash
   npm install
   ```

2. **执行部署命令**
   ```bash
   npm run deploy
   ```

3. **在 GitHub 仓库设置中配置 GitHub Pages**
   - 进入仓库的 Settings > Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages" 分支，目录选择 "/ (root)"
   - 保存设置

4. **访问网站**
   - 部署完成后，访问 `https://你的用户名.github.io/168fasting/`

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 注意事项

- 如果你的仓库名不是 `168fasting`，需要修改 `vite.config.js` 中的 `base` 配置
- PWA 功能需要 HTTPS 才能正常工作，GitHub Pages 默认支持 HTTPS
- 本地存储使用 IndexedDB，数据保存在浏览器本地

