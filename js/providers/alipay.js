// 支付宝登录提供商
class AlipayProvider {
    constructor() {
        this.name = 'alipay';
        this.displayName = '支付宝';
    }
    
    // 执行登录
    async login(config) {
        return new Promise((resolve, reject) => {
            try {
                // 构建支付宝授权URL
                const authUrl = this.buildAuthUrl(config);
                
                // 打开授权窗口
                const popup = window.open(authUrl, 'alipay_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
                
                if (!popup) {
                    reject(new Error('无法打开登录窗口，请检查浏览器弹窗设置'));
                    return;
                }
                
                // 监听窗口关闭
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        reject(new Error('用户取消登录'));
                    }
                }, 1000);
                
                // 监听授权回调消息
                const messageHandler = (event) => {
                    if (event.origin !== window.location.origin) return;
                    
                    if (event.data.type === 'alipay_login_success') {
                        clearInterval(checkClosed);
                        popup.close();
                        window.removeEventListener('message', messageHandler);
                        
                        // 获取用户信息
                        this.getUserInfo(event.data.code, config)
                            .then(userInfo => resolve(userInfo))
                            .catch(error => reject(error));
                            
                    } else if (event.data.type === 'alipay_login_error') {
                        clearInterval(checkClosed);
                        popup.close();
                        window.removeEventListener('message', messageHandler);
                        reject(new Error(event.data.error || '支付宝登录失败'));
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // 构建授权URL
    buildAuthUrl(config) {
        const params = new URLSearchParams({
            app_id: config.appId,
            scope: 'auth_user',
            redirect_uri: config.redirectUri,
            state: `alipay_login_${Date.now()}`
        });
        
        return `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?${params.toString()}`;
    }
    
    // 获取用户信息
    async getUserInfo(code, config) {
        try {
            // 模拟API调用获取access_token
            const tokenResponse = await this.getAccessToken(code, config);
            
            // 模拟API调用获取用户信息
            const userInfo = await this.fetchUserInfo(tokenResponse.access_token);
            
            return {
                id: userInfo.user_id,
                userId: userInfo.user_id,
                nickname: userInfo.nick_name,
                avatar: userInfo.avatar,
                email: userInfo.email,
                phone: userInfo.phone,
                loginType: 'alipay',
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresIn: tokenResponse.expires_in
            };
            
        } catch (error) {
            throw new Error(`获取支付宝用户信息失败: ${error.message}`);
        }
    }
    
    // 获取访问令牌
    async getAccessToken(code, config) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    access_token: 'mock_alipay_access_token_' + Date.now(),
                    expires_in: 7200,
                    refresh_token: 'mock_alipay_refresh_token_' + Date.now(),
                    user_id: 'mock_alipay_user_' + Date.now()
                });
            }, 500);
        });
    }
    
    // 获取用户详细信息
    async fetchUserInfo(accessToken) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    user_id: 'alipay_user_' + Math.random().toString(36).substr(2, 8),
                    nick_name: '支付宝用户_' + Math.random().toString(36).substr(2, 5),
                    avatar: 'https://via.placeholder.com/100x100?text=支付宝',
                    email: 'user@alipay.com',
                    phone: '138****8888',
                    is_certified: true,
                    user_type: '1',
                    user_status: 'T'
                });
            }, 500);
        });
    }
}

// 注册支付宝提供商
if (typeof window !== 'undefined') {
    window.AlipayProvider = AlipayProvider;
}