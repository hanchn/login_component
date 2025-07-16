// GitHub登录提供商
class GithubProvider {
    constructor() {
        this.name = 'github';
        this.displayName = 'GitHub';
    }
    
    // 执行登录
    async login(config) {
        return new Promise((resolve, reject) => {
            try {
                // 构建GitHub授权URL
                const authUrl = this.buildAuthUrl(config);
                
                // 打开授权窗口
                const popup = window.open(authUrl, 'github_login', 'width=600,height=600,scrollbars=yes,resizable=yes');
                
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
                    
                    if (event.data.type === 'github_login_success') {
                        clearInterval(checkClosed);
                        popup.close();
                        window.removeEventListener('message', messageHandler);
                        
                        // 获取用户信息
                        this.getUserInfo(event.data.code, config)
                            .then(userInfo => resolve(userInfo))
                            .catch(error => reject(error));
                            
                    } else if (event.data.type === 'github_login_error') {
                        clearInterval(checkClosed);
                        popup.close();
                        window.removeEventListener('message', messageHandler);
                        reject(new Error(event.data.error || 'GitHub登录失败'));
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
            scope: 'user:email',
            state: `github_login_${Date.now()}`,
            allow_signup: 'true'
        });
        
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }
    
    // 获取用户信息
    async getUserInfo(code, config) {
        try {
            // 模拟API调用获取access_token
            const tokenResponse = await this.getAccessToken(code, config);
            
            // 模拟API调用获取用户信息
            const userInfo = await this.fetchUserInfo(tokenResponse.access_token);
            
            // 获取用户邮箱
            const emails = await this.fetchUserEmails(tokenResponse.access_token);
            const primaryEmail = emails.find(email => email.primary) || emails[0];
            
            return {
                id: userInfo.id.toString(),
                username: userInfo.login,
                nickname: userInfo.name || userInfo.login,
                avatar: userInfo.avatar_url,
                email: primaryEmail ? primaryEmail.email : null,
                bio: userInfo.bio,
                blog: userInfo.blog,
                company: userInfo.company,
                location: userInfo.location,
                publicRepos: userInfo.public_repos,
                followers: userInfo.followers,
                following: userInfo.following,
                createdAt: userInfo.created_at,
                loginType: 'github',
                accessToken: tokenResponse.access_token,
                tokenType: tokenResponse.token_type,
                scope: tokenResponse.scope
            };
            
        } catch (error) {
            throw new Error(`获取GitHub用户信息失败: ${error.message}`);
        }
    }
    
    // 获取访问令牌
    async getAccessToken(code, config) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 实际应用中应该调用后端API
                resolve({
                    access_token: 'gho_mock_github_token_' + Date.now(),
                    token_type: 'bearer',
                    scope: 'user:email'
                });
            }, 500);
        });
    }
    
    // 获取用户详细信息
    async fetchUserInfo(accessToken) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 实际应用中应该调用GitHub API
                const mockId = Math.floor(Math.random() * 1000000);
                const mockUsername = 'github_user_' + Math.random().toString(36).substr(2, 5);
                
                resolve({
                    id: mockId,
                    login: mockUsername,
                    name: 'GitHub User',
                    avatar_url: `https://avatars.githubusercontent.com/u/${mockId}?v=4`,
                    bio: 'A passionate developer',
                    blog: 'https://example.com',
                    company: 'Tech Company',
                    location: 'San Francisco, CA',
                    public_repos: Math.floor(Math.random() * 100),
                    followers: Math.floor(Math.random() * 1000),
                    following: Math.floor(Math.random() * 500),
                    created_at: '2020-01-01T00:00:00Z',
                    updated_at: new Date().toISOString(),
                    html_url: `https://github.com/${mockUsername}`,
                    type: 'User'
                });
            }, 500);
        });
    }
    
    // 获取用户邮箱
    async fetchUserEmails(accessToken) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 实际应用中应该调用GitHub API
                resolve([
                    {
                        email: 'user@example.com',
                        primary: true,
                        verified: true,
                        visibility: 'public'
                    },
                    {
                        email: 'user@users.noreply.github.com',
                        primary: false,
                        verified: true,
                        visibility: null
                    }
                ]);
            }, 300);
        });
    }
    
    // 获取用户仓库
    async fetchUserRepos(accessToken, page = 1, perPage = 30) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const repos = [];
                for (let i = 0; i < Math.min(perPage, 10); i++) {
                    repos.push({
                        id: Math.floor(Math.random() * 1000000),
                        name: `repo-${i + 1}`,
                        full_name: `user/repo-${i + 1}`,
                        description: `Description for repo ${i + 1}`,
                        private: Math.random() > 0.7,
                        html_url: `https://github.com/user/repo-${i + 1}`,
                        language: ['JavaScript', 'Python', 'Java', 'Go', 'TypeScript'][Math.floor(Math.random() * 5)],
                        stargazers_count: Math.floor(Math.random() * 100),
                        forks_count: Math.floor(Math.random() * 50),
                        created_at: '2023-01-01T00:00:00Z',
                        updated_at: new Date().toISOString()
                    });
                }
                resolve(repos);
            }, 500);
        });
    }
}

// 注册GitHub提供商
if (typeof window !== 'undefined') {
    window.GithubProvider = GithubProvider;
}