# 部署指南

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

1. 登录您的 GitHub 账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库名称（例如：life-journey）
4. 选择 "Public" 或 "Private" 仓库类型
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 2. 推送代码到 GitHub

在您的本地终端中执行以下命令：

```bash
# 添加远程仓库（请将下面的 URL 替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 推送代码
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入您的 GitHub 仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Build and deployment" 部分：
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 "main" 分支
   - Folder: 选择 "/root"
5. 点击 "Save"

### 4. 访问您的网站

等待几分钟后，您的网站将在以下地址上线：

```
https://您的用户名.github.io/您的仓库名/
```

## 部署到 Gitee Pages（推荐国内用户）

### 1. 创建 Gitee 仓库

1. 登录您的 Gitee 账号
2. 点击右上角的 "+" 按钮，选择 "新建仓库"
3. 填写仓库名称
4. 选择 "公开" 或 "私有" 仓库类型
5. **不要**勾选 "使用 Readme 初始化仓库"
6. 点击 "创建"

### 2. 推送代码到 Gitee

```bash
# 添加远程仓库（请将下面的 URL 替换为您的仓库地址）
git remote add gitee https://gitee.com/您的用户名/您的仓库名.git

# 推送代码
git push -u gitee main
```

### 3. 启用 Gitee Pages

1. 进入您的 Gitee 仓库
2. 点击 "服务" -> "Gitee Pages"
3. 选择 "main" 分支
4. 点击 "启动"

## 更新网站

当您需要更新网站时：

1. 修改代码
2. 重新构建（如果有更改）：
   ```bash
   npm run build
   ```
3. 提交并推送更改：
   ```bash
   git add .
   git commit -m "更新内容"
   git push
   ```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```
