// 账号密码登录管理
class PasswordLogin {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const form = document.getElementById('passwordForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        // 表单提交
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // 密码显示/隐藏切换
        togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        // 输入验证
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                this.clearInputError(input);
            });
        });
    }
    
    // 处理登录
    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // 验证输入
        if (!this.validateForm()) {
            return;
        }
        
        try {
            this.showLoading(true);
            
            // 调用登录API
            const result = await this.loginWithPassword(username, password, rememberMe);
            
            // 处理登录成功
            this.handleLoginSuccess(result);
            
        } catch (error) {
            console.error('登录失败:', error);
            this.showError(error.message || '登录失败，请检查用户名和密码');
        } finally {
            this.showLoading(false);
        }
    }
    
    // 账号密码登录API调用
    async loginWithPassword(username, password, rememberMe) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟登录验证
                if (username === 'admin' && password === '123456') {
                    resolve({
                        success: true,
                        userInfo: {
                            id: '1001',
                            username: 'admin',
                            nickname: '管理员',
                            email: 'admin@example.com',
                            avatar: 'https://via.placeholder.com/50',
                            phone: '13800138000'
                        },
                        token: 'mock_jwt_token_' + Date.now(),
                        rememberMe: rememberMe
                    });
                } else if (username === 'user@example.com' && password === 'password') {
                    resolve({
                        success: true,
                        userInfo: {
                            id: '1002',
                            username: 'user@example.com',
                            nickname: '普通用户',
                            email: 'user@example.com',
                            avatar: 'https://via.placeholder.com/50',
                            phone: '13900139000'
                        },
                        token: 'mock_jwt_token_' + Date.now(),
                        rememberMe: rememberMe
                    });
                } else {
                    reject(new Error('用户名或密码错误'));
                }
            }, 1500);
        });
    }
    
    // 表单验证
    validateForm() {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        let isValid = true;
        
        if (!this.validateInput(username)) {
            isValid = false;
        }
        
        if (!this.validateInput(password)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    // 输入验证
    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // 清除之前的错误状态
        this.clearInputError(input);
        
        if (input.id === 'username') {
            if (!value) {
                errorMessage = '请输入用户名/邮箱/手机号';
                isValid = false;
            } else if (value.length < 3) {
                errorMessage = '用户名至少3个字符';
                isValid = false;
            }
        } else if (input.id === 'password') {
            if (!value) {
                errorMessage = '请输入密码';
                isValid = false;
            } else if (value.length < 6) {
                errorMessage = '密码至少6个字符';
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showInputError(input, errorMessage);
        }
        
        return isValid;
    }
    
    // 显示输入错误
    showInputError(input, message) {
        input.style.borderColor = '#ff4d4f';
        input.style.background = '#fff2f0';
        
        // 移除已存在的错误消息
        const existingError = input.parentNode.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 添加错误消息
        const errorEl = document.createElement('div');
        
        // 添加错误样式
        input.style.borderColor = '#ff4757';
        input.style.background = '#fff5f5';
        
        // 显示错误消息
        let errorEl = wrapper.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.style.cssText = `
                color: #ff4757;
                font-size: 12px;
                margin-top: 5px;
                text-align: left;
            `;
            wrapper.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }
    
    // 清除输入错误
    clearInputError(input) {
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.remove('error');
        
        // 恢复正常样式
        input.style.borderColor = '#e0e0e0';
        input.style.background = '#fafafa';
        
        // 移除错误消息
        const errorEl = wrapper.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    // 切换密码显示/隐藏
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye toggle-password';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye-slash toggle-password';
        }
    }
    
    // 显示加载状态
    showLoading() {
        const submitBtn = document.querySelector('.login-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner"></div>
            登录中...
        `;
    }
    
    // 隐藏加载状态
    hideLoading() {
        const submitBtn = document.querySelector('.login-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i class="fas fa-sign-in-alt"></i>
            登录
        `;
    }
    
    // 显示错误消息
    showError(message) {
        // 复用社交登录的消息显示方法
        if (window.socialLogin) {
            window.socialLogin.showMessage(message, 'error');
        } else {
            alert(message);
        }
    }
    
    // 处理登录成功
    handleLoginSuccess(result) {
        console.log('密码登录成功:', result);
        
        // 存储登录信息
        if (result.rememberMe) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('rememberMe', 'true');
        } else {
            sessionStorage.setItem('authToken', result.token);
        }
        
        // 触发登录成功事件
        window.dispatchEvent(new CustomEvent('loginSuccess', {
            detail: {
                provider: 'password',
                userInfo: result.user,
                token: result.token
            }
        }));
        
        // 显示成功消息
        if (window.socialLogin) {
            window.socialLogin.showMessage(`欢迎回来，${result.user.nickname}！`, 'success');
        }
    }
}

// 全局密码登录实例
window.passwordLogin = new PasswordLogin();