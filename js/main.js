// 主应用控制器
class LoginApp {
    constructor() {
        this.currentTab = 'password';
        this.init();
    }
    
    init() {
        // 应用初始配置
        window.loginConfig.applyConfig();
        
        // 绑定标签切换事件
        this.bindTabEvents();
        
        // 绑定配置相关事件
        this.bindConfigEvents();
        
        // 监听登录成功事件
        this.bindLoginEvents();
        
        console.log('社交登录模块初始化完成');
    }
    
    bindConfigEvents() {
        const configBtn = document.getElementById('configBtn');
        const configModal = document.getElementById('configModal');
        const closeModal = document.getElementById('closeModal');
        const saveConfig = document.getElementById('saveConfig');
        const cancelConfig = document.getElementById('cancelConfig');
        
        // 打开配置模态框
        configBtn.addEventListener('click', () => {
            this.openConfigModal();
        });
        
        // 关闭配置模态框
        closeModal.addEventListener('click', () => {
            this.closeConfigModal();
        });
        
        cancelConfig.addEventListener('click', () => {
            this.closeConfigModal();
        });
        
        // 点击模态框外部关闭
        configModal.addEventListener('click', (e) => {
            if (e.target === configModal) {
                this.closeConfigModal();
            }
        });
        
        // 保存配置
        saveConfig.addEventListener('click', () => {
            this.saveConfiguration();
        });
    }
    
    bindLoginEvents() {
        // 监听登录成功事件
        window.addEventListener('loginSuccess', (e) => {
            const { provider, userInfo } = e.detail;
            this.handleLoginSuccess(provider, userInfo);
        });
    }
    
    // 打开配置模态框
    openConfigModal() {
        const modal = document.getElementById('configModal');
        modal.style.display = 'block';
        
        // 加载当前配置到表单
        this.loadConfigToForm();
    }
    
    // 关闭配置模态框
    closeConfigModal() {
        const modal = document.getElementById('configModal');
        modal.style.display = 'none';
    }
    
    // 加载配置到表单
    loadConfigToForm() {
        const config = window.loginConfig.config;
        
        // 设置各个提供商的启用状态
        Object.keys(config.providers).forEach(provider => {
            const checkbox = document.getElementById(`enable${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
            if (checkbox) {
                checkbox.checked = config.providers[provider].enabled;
            }
        });
        
        // 设置二维码启用状态
        const qrCheckbox = document.getElementById('enableQrCode');
        if (qrCheckbox) {
            qrCheckbox.checked = config.qrCode.enabled;
        }
    }
    
    // 保存配置
    saveConfiguration() {
        const newConfig = {
            providers: {},
            qrCode: {}
        };
        
        // 获取各个提供商的配置
        const providers = ['wechat', 'alipay', 'google', 'github', 'weibo', 'qq', 'facebook', 'twitter'];
        providers.forEach(provider => {
            const checkbox = document.getElementById(`enable${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
            if (checkbox) {
                newConfig.providers[provider] = {
                    ...window.loginConfig.config.providers[provider],
                    enabled: checkbox.checked
                };
            }
        });
        
        // 获取二维码配置
        const qrCheckbox = document.getElementById('enableQrCode');
        if (qrCheckbox) {
            newConfig.qrCode = {
                ...window.loginConfig.config.qrCode,
                enabled: qrCheckbox.checked
            };
        }
        
        // 保存配置
        window.loginConfig.saveConfig(newConfig);
        
        // 关闭模态框
        this.closeConfigModal();
        
        // 显示保存成功消息
        this.showMessage('配置保存成功！', 'success');
        
        // 如果二维码配置改变，重新初始化二维码
        if (newConfig.qrCode.enabled !== window.loginConfig.config.qrCode.enabled) {
            if (newConfig.qrCode.enabled && window.qrLogin) {
                window.qrLogin.generateQRCode();
            }
        }
    }
    
    // 处理登录成功
    handleLoginSuccess(provider, userInfo) {
        console.log('登录成功:', { provider, userInfo });
        
        // 这里可以添加登录成功后的处理逻辑
        // 例如：跳转到指定页面、存储用户信息等
        
        // 示例：存储用户信息到localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            provider,
            userInfo,
            loginTime: new Date().toISOString()
        }));
        
        // 示例：3秒后模拟跳转
        setTimeout(() => {
            // window.location.href = '/dashboard';
            console.log('模拟跳转到用户面板');
        }, 3000);
    }
    
    // 显示消息（复用社交登录的方法）
    showMessage(message, type = 'info') {
        if (window.socialLogin) {
            window.socialLogin.showMessage(message, type);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.loginApp = new LoginApp();
});