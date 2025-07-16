// 登录配置管理
class LoginConfig {
    constructor() {
        this.defaultConfig = {
            providers: {
                wechat: {
                    enabled: true,
                    appId: 'your_wechat_app_id',
                    redirectUri: 'your_redirect_uri'
                },
                alipay: {
                    enabled: true,
                    appId: 'your_alipay_app_id',
                    redirectUri: 'your_redirect_uri'
                },
                google: {
                    enabled: true,
                    clientId: 'your_google_client_id',
                    redirectUri: 'your_redirect_uri'
                },
                github: {
                    enabled: true,
                    clientId: 'your_github_client_id',
                    redirectUri: 'your_redirect_uri'
                },
                weibo: {
                    enabled: true,
                    appKey: 'your_weibo_app_key',
                    redirectUri: 'your_redirect_uri'
                },
                qq: {
                    enabled: true,
                    appId: 'your_qq_app_id',
                    redirectUri: 'your_redirect_uri'
                },
                facebook: {
                    enabled: true,
                    appId: 'your_facebook_app_id',
                    redirectUri: 'your_redirect_uri'
                },
                twitter: {
                    enabled: true,
                    apiKey: 'your_twitter_api_key',
                    redirectUri: 'your_redirect_uri'
                }
            },
            qrCode: {
                enabled: true,
                refreshInterval: 30000 // 30秒刷新一次
            },
            theme: {
                primaryColor: '#667eea',
                borderRadius: '12px'
            }
        };
        
        this.config = this.loadConfig();
    }
    
    // 加载配置
    loadConfig() {
        const savedConfig = localStorage.getItem('socialLoginConfig');
        if (savedConfig) {
            try {
                return { ...this.defaultConfig, ...JSON.parse(savedConfig) };
            } catch (e) {
                console.warn('配置加载失败，使用默认配置');
                return this.defaultConfig;
            }
        }
        return this.defaultConfig;
    }
    
    // 保存配置
    saveConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('socialLoginConfig', JSON.stringify(this.config));
        this.applyConfig();
    }
    
    // 应用配置
    applyConfig() {
        // 显示/隐藏登录按钮
        Object.keys(this.config.providers).forEach(provider => {
            const button = document.getElementById(`${provider}Btn`);
            if (button) {
                if (this.config.providers[provider].enabled) {
                    button.classList.remove('hidden');
                } else {
                    button.classList.add('hidden');
                }
            }
        });
        
        // 显示/隐藏扫码区域
        const qrSection = document.getElementById('qrSection');
        if (qrSection) {
            if (this.config.qrCode.enabled) {
                qrSection.classList.remove('hidden');
            } else {
                qrSection.classList.add('hidden');
            }
        }
    }
    
    // 获取提供商配置
    getProviderConfig(provider) {
        return this.config.providers[provider] || null;
    }
    
    // 检查提供商是否启用
    isProviderEnabled(provider) {
        return this.config.providers[provider]?.enabled || false;
    }
    
    // 获取二维码配置
    getQrConfig() {
        return this.config.qrCode;
    }
}

// 全局配置实例
window.loginConfig = new LoginConfig();