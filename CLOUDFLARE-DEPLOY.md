# Cloudflare Pages 配置

## 1. Cloudflare Dashboard 配置步骤

### 步骤 1: 登录 Cloudflare
访问 https://dash.cloudflare.com 并登录

### 步骤 2: 创建 Pages 项目
1. 点击左侧菜单 **Workers & Pages**
2. 点击 **Create application** → **Pages** → **Connect to Git**

### 步骤 3: 连接 GitHub
1. 点击 **Connect GitHub account**
2. 授权 Cloudflare 访问你的 GitHub
3. 选择仓库: **oxygen02/promptbox**

### 步骤 4: 配置构建设置
| 配置项 | 值 |
|--------|-----|
| Production branch | `v1.1.1-release` 或 `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |

### 步骤 5: 添加环境变量（可选）
如果需要配置后端 API 地址，添加：
```
NEXT_PUBLIC_API_BASE=http://124.156.200.127:3002
```

### 步骤 6: 设置自定义域名
1. 项目创建完成后，进入 **Custom domains**
2. 添加域名: `promptbox.cloud`
3. 按照提示配置 DNS 记录

---

## 2. 注意事项

### 前端调用后端
当前配置：
- 前端静态资源 → Cloudflare Pages (promptbox.cloud)
- 后端 API → 腾讯云服务器 (124.156.200.127:3002)

前端页面中的 API 调用已硬编码为 `http://124.156.200.127:3002`

如需修改，可通过环境变量配置（需要重新构建部署）

---

## 3. 部署后访问
- 前端: https://promptbox.cloud
- 后端 API: http://124.156.200.127:3002 (保持不变)