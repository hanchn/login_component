# 社交登录模块

一个功能完整的独立前端社交登录模块，支持多种社交媒体平台登录和扫码登录功能。

## 功能特性

- 🔐 支持8种主流社交平台登录
- 📱 支持微信、支付宝扫码登录
- ⚙️ 灵活的配置系统
- 🎨 现代化的UI设计
- 📱 响应式布局
- 🔧 易于集成和定制

## 支持的登录平台

- 微信登录
- 支付宝登录
- Google登录
- GitHub登录
- 微博登录
- QQ登录
- Facebook登录
- Twitter登录

## 快速开始

1. 下载所有文件到您的项目目录
2. 在HTML页面中引入相关文件
3. 配置各平台的应用ID和回调地址
4. 根据需要启用或禁用特定的登录方式

## 配置说明

### 基本配置

在 `js/config.js` 文件中修改 `defaultConfig` 对象：

```javascript
defaultConfig: {
    providers: {
        wechat: {
            enabled: true,
            appId: 'your_wechat_app_id',
            redirectUri: 'your_redirect_uri'
        },
        // ... 其他平台配置
    }
}