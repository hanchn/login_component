// Google登录提供商
class GoogleProvider {
    constructor() {
        this.name = 'google';
        this.displayName = 'Google';
    }
    
    // 执行登录
    async login(config) {
        return new Promise((resolve, reject) => {
            try {
                // 构建Google授权URL
                const authUrl = this.buildAuthUrl(config);
                
                // 打开授权窗口
                const popup = window.open(authUrl, 'google_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
                
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
                    
                    if (event.data.type === 'google_login_success') {
                        clearInterval(checkClosed);
                        popup.close();
                        window.removeEventListener('message', messageHandler);
                        
                        // 获取用户信息
                        this.getUserInfo(event.data.code, config)
                            .then(userInfo => resolve(userInfo))
                            .catch(error => reject(error));
                            
                    } else if (event.data.type === 'google_login_error') {
                        clearInterval(checkClosed);
                        popup.close();
                        window.removeEventListener('message', messageHandler);
                        reject(new Error(event.data.error || 'Google登录失败'));
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
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            response_type: 'code',
            scope: 'openid profile email',
            access_type: 'offline',
            state: `google_login_${Date.now()}`,
            prompt: 'consent'
        });
        
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    
    // 获取用户信息
    async getUserInfo(code, config) {
        try {
            // 模拟API调用获取access_token
            const tokenResponse = await this.getAccessToken(code, config);
            
            // 模拟API调用获取用户信息
            const userInfo = await this.fetchUserInfo(tokenResponse.access_token);
            
            return {
                id: userInfo.sub,
                googleId: userInfo.sub,
                email: userInfo.email,
                emailVerified: userInfo.email_verified,
                nickname: userInfo.name,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                avatar: userInfo.picture,
                locale: userInfo.locale,
                loginType: 'google',
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                idToken: tokenResponse.id_token,
                expiresIn: tokenResponse.expires_in,
                tokenType: tokenResponse.token_type
            };
            
        } catch (error) {
            throw new Error(`获取Google用户信息失败: ${error.message}`);
        }
    }
    
    // 获取访问令牌
    async getAccessToken(code, config) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 实际应用中应该调用后端API
                resolve({
                    access_token: 'ya29.mock_google_access_token_' + Date.now(),
                    expires_in: 3599,
                    refresh_token: 'mock_google_refresh_token_' + Date.now(),
                    scope: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                    token_type: 'Bearer',
                    id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Im1vY2tfa2V5X2lkIn0.mock_jwt_payload.mock_signature'
                });
            }, 500);
        });
    }
    
    // 获取用户详细信息
    async fetchUserInfo(accessToken) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 实际应用中应该调用Google API
                const mockId = 'google_' + Math.random().toString(36).substr(2, 15);
                const mockEmail = `user${Math.floor(Math.random() * 1000)}@gmail.com`;
                
                resolve({
                    sub: mockId,
                    name: 'Google User',
                    given_name: 'Google',
                    family_name: 'User',
                    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                    email: mockEmail,
                    email_verified: true,
                    locale: 'zh-CN',
                    hd: null // 如果是G Suite用户，这里会有域名
                });
            }, 500);
        });
    }
    
    // 刷新访问令牌
    async refreshAccessToken(refreshToken, config) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    access_token: 'ya29.new_mock_google_access_token_' + Date.now(),
                    expires_in: 3599,
                    scope: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                    token_type: 'Bearer'
                });
            }, 500);
        });
    }
    
    // 撤销访问令牌
    async revokeToken(token) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 300);
        });
    }
}

// 注册Google提供商
if (typeof window !== 'undefined') {
    window.GoogleProvider = GoogleProvider;
}