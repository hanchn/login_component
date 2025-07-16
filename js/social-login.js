// 社交登录管理
class SocialLogin {
    constructor() {
        this.providers = {
            wechat: this.wechatLogin.bind(this),
            alipay: this.alipayLogin.bind(this),
            google: this.googleLogin.bind(this),
            github: this.githubLogin.bind(this),
            weibo: this.weiboLogin.bind(this),
            qq: this.qqLogin.bind(this),
            facebook: this.facebookLogin.bind(this),
            twitter: this.twitterLogin.bind(this)
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // 绑定所有社交登录按钮
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = e.currentTarget.dataset.provider;
                this.login(provider);
            });
        });
    }
    
    // 统一登录入口
    async login(provider) {
        const config = window.loginConfig.getProviderConfig(provider);
        
        if (!config || !config.enabled) {
            this.showMessage(`${provider}登录未启用`, 'error');
            return;
        }
        
        try {
            this.showLoading(provider);
            const result = await this.providers[provider](config);
            this.handleLoginResult(provider, result);
        } catch (error) {
            console.error(`${provider}登录失败:`, error);
            this.showMessage(`${provider}登录失败: ${error.message}`, 'error');
        } finally {
            this.hideLoading(provider);
        }
    }
    
    // 微信登录
    async wechatLogin(config) {
        return new Promise((resolve, reject) => {
            // 微信登录逻辑
            const authUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=snsapi_login&state=wechat_login`;
            
            const popup = window.open(authUrl, 'wechat_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 监听消息
            window.addEventListener('message', function handler(event) {
                if (event.origin !== window.location.origin) return;
                
                if (event.data.type === 'wechat_login_success') {
                    clearInterval(checkClosed);
                    popup.close();
                    window.removeEventListener('message', handler);
                    resolve(event.data.userInfo);
                } else if (event.data.type === 'wechat_login_error') {
                    clearInterval(checkClosed);
                    popup.close();
                    window.removeEventListener('message', handler);
                    reject(new Error(event.data.error));
                }
            });
        });
    }
    
    // 支付宝登录
    async alipayLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${config.appId}&scope=auth_user&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=alipay_login`;
            
            const popup = window.open(authUrl, 'alipay_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: '支付宝用户',
                    avatar: 'https://via.placeholder.com/50',
                    userId: 'alipay_user_123'
                });
            }, 2000);
        });
    }
    
    // Google登录
    async googleLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=openid%20profile%20email&response_type=code&state=google_login`;
            
            const popup = window.open(authUrl, 'google_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: 'Google用户',
                    avatar: 'https://via.placeholder.com/50',
                    email: 'user@gmail.com'
                });
            }, 2000);
        });
    }
    
    // GitHub登录
    async githubLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=user:email&state=github_login`;
            
            const popup = window.open(authUrl, 'github_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: 'GitHub用户',
                    avatar: 'https://via.placeholder.com/50',
                    username: 'github_user'
                });
            }, 2000);
        });
    }
    
    // 微博登录
    async weiboLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://api.weibo.com/oauth2/authorize?client_id=${config.appKey}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&state=weibo_login`;
            
            const popup = window.open(authUrl, 'weibo_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: '微博用户',
                    avatar: 'https://via.placeholder.com/50',
                    uid: 'weibo_user_123'
                });
            }, 2000);
        });
    }
    
    // QQ登录
    async qqLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${config.appId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=qq_login&scope=get_user_info`;
            
            const popup = window.open(authUrl, 'qq_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: 'QQ用户',
                    avatar: 'https://via.placeholder.com/50',
                    openid: 'qq_user_123'
                });
            }, 2000);
        });
    }
    
    // Facebook登录
    async facebookLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${config.appId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=email,public_profile&response_type=code&state=facebook_login`;
            
            const popup = window.open(authUrl, 'facebook_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: 'Facebook用户',
                    avatar: 'https://via.placeholder.com/50',
                    email: 'user@facebook.com'
                });
            }, 2000);
        });
    }
    
    // Twitter登录
    async twitterLogin(config) {
        return new Promise((resolve, reject) => {
            const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${config.apiKey}&oauth_callback=${encodeURIComponent(config.redirectUri)}`;
            
            const popup = window.open(authUrl, 'twitter_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
            
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('用户取消登录'));
                }
            }, 1000);
            
            // 模拟登录成功
            setTimeout(() => {
                clearInterval(checkClosed);
                popup.close();
                resolve({
                    nickname: 'Twitter用户',
                    avatar: 'https://via.placeholder.com/50',
                    username: 'twitter_user'
                });
            }, 2000);
        });
    }
    
    // 显示加载状态
    showLoading(provider) {
        const btn = document.getElementById(`${provider}Btn`);
        if (btn) {
            btn.style.opacity = '0.6';
            btn.style.pointerEvents = 'none';
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
            btn.dataset.originalText = originalText;
        }
    }
    
    // 隐藏加载状态
    hideLoading(provider) {
        const btn = document.getElementById(`${provider}Btn`);
        if (btn && btn.dataset.originalText) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.innerHTML = btn.dataset.originalText;
            delete btn.dataset.originalText;
        }
    }
    
    // 处理登录结果
    handleLoginResult(provider, result) {
        console.log(`${provider}登录成功:`, result);
        
        // 触发登录成功事件
        window.dispatchEvent(new CustomEvent('loginSuccess', {
            detail: {
                provider: provider,
                userInfo: result
            }
        }));
        
        this.showMessage(`${provider}登录成功！欢迎，${result.nickname || result.username || '用户'}`, 'success');
    }
    
    // 显示消息
    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        switch (type) {
            case 'success':
                messageEl.style.background = 'linear-gradient(135deg, #52c41a, #73d13d)';
                break;
            case 'error':
                messageEl.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)';
                break;
            default:
                messageEl.style.background = 'linear-gradient(135deg, #1890ff, #40a9ff)';
        }
        
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
}

// 添加动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// 全局社交登录实例
window.socialLogin = new SocialLogin();