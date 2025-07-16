// 社交登录管理 - 重构版本
class SocialLogin {
    constructor() {
        this.providers = {};
        this.init();
    }
    
    init() {
        this.loadProviders();
        this.bindEvents();
    }
    
    // 动态加载所有提供商
    loadProviders() {
        const providerClasses = {
            wechat: 'WechatProvider',
            alipay: 'AlipayProvider', 
            google: 'GoogleProvider',
            github: 'GithubProvider',
            weibo: 'WeiboProvider',
            qq: 'QQProvider',
            facebook: 'FacebookProvider',
            twitter: 'TwitterProvider'
        };
        
        Object.keys(providerClasses).forEach(key => {
            const ProviderClass = window[providerClasses[key]];
            if (ProviderClass) {
                this.providers[key] = new ProviderClass();
            } else {
                console.warn(`${providerClasses[key]} 未加载`);
            }
        });
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
        
        const providerInstance = this.providers[provider];
        if (!providerInstance) {
            this.showMessage(`${provider}登录提供商未找到`, 'error');
            return;
        }
        
        try {
            this.showLoading(provider);
            const result = await providerInstance.login(config);
            this.handleLoginResult(provider, result);
        } catch (error) {
            console.error(`${provider}登录失败:`, error);
            this.showMessage(`${provider}登录失败: ${error.message}`, 'error');
        } finally {
            this.hideLoading(provider);
        }
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