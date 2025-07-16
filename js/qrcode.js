// 二维码登录管理
class QRCodeLogin {
    constructor() {
        this.currentType = 'wechat';
        this.qrData = null;
        this.refreshTimer = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateQRCode();
    }
    
    bindEvents() {
        // 二维码标签切换
        document.querySelectorAll('.qr-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.switchQRType(type);
            });
        });
    }
    
    // 切换二维码类型
    switchQRType(type) {
        this.currentType = type;
        
        // 更新标签状态
        document.querySelectorAll('.qr-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // 更新二维码
        this.generateQRCode();
    }
    
    // 生成二维码
    async generateQRCode() {
        const qrContainer = document.getElementById('qrCode');
        const config = window.loginConfig.getProviderConfig(this.currentType);
        
        if (!config || !config.enabled) {
            qrContainer.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: #ff6b6b; font-size: 48px; margin-bottom: 15px;"></i>
                <p style="color: #ff6b6b;">${this.currentType}登录未启用</p>
            `;
            return;
        }
        
        // 显示加载状态
        qrContainer.innerHTML = `
            <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
            <p>正在生成二维码...</p>
        `;
        
        try {
            // 模拟API调用生成二维码
            const qrData = await this.requestQRCode(this.currentType);
            this.displayQRCode(qrData);
            
            // 开始轮询检查扫码状态
            this.startPolling();
            
        } catch (error) {
            console.error('生成二维码失败:', error);
            qrContainer.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: #ff6b6b; font-size: 48px; margin-bottom: 15px;"></i>
                <p style="color: #ff6b6b;">二维码生成失败，请重试</p>
                <button onclick="qrLogin.generateQRCode()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">重新生成</button>
            `;
        }
    }
    
    // 请求二维码数据
    async requestQRCode(type) {
        // 这里应该调用实际的API
        // 模拟API响应
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    qrCode: `https://api.example.com/qr/${type}/${Date.now()}`,
                    ticket: `ticket_${Date.now()}`,
                    expireTime: Date.now() + 300000 // 5分钟过期
                });
            }, 1000);
        });
    }
    
    // 显示二维码
    displayQRCode(qrData) {
        this.qrData = qrData;
        const qrContainer = document.getElementById('qrCode');
        const iconClass = this.currentType === 'wechat' ? 'fab fa-weixin' : 'fab fa-alipay';
        const iconColor = this.currentType === 'wechat' ? '#09bb07' : '#1677ff';
        const tipText = this.currentType === 'wechat' ? '请使用微信扫描二维码登录' : '请使用支付宝扫描二维码登录';
        
        qrContainer.className = `qr-code ${this.currentType}`;
        qrContainer.innerHTML = `
            <div style="width: 150px; height: 150px; background: url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData.qrCode)}') center/cover; margin: 0 auto 15px; border-radius: 8px;"></div>
            <i class="${iconClass}" style="color: ${iconColor}; font-size: 24px; margin-bottom: 10px;"></i>
            <p style="color: #666; font-size: 14px;">${tipText}</p>
            <p style="color: #999; font-size: 12px; margin-top: 5px;">二维码5分钟内有效</p>
        `;
    }
    
    // 开始轮询检查扫码状态
    startPolling() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(async () => {
            try {
                const status = await this.checkQRStatus();
                this.handleQRStatus(status);
            } catch (error) {
                console.error('检查二维码状态失败:', error);
            }
        }, 2000); // 每2秒检查一次
        
        // 5分钟后自动刷新二维码
        setTimeout(() => {
            if (this.qrData) {
                this.generateQRCode();
            }
        }, 300000);
    }
    
    // 检查二维码状态
    async checkQRStatus() {
        if (!this.qrData) return null;
        
        // 模拟API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                // 随机返回状态用于演示
                const statuses = ['waiting', 'scanned', 'confirmed', 'expired'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                resolve({
                    status: randomStatus,
                    userInfo: randomStatus === 'confirmed' ? {
                        nickname: '测试用户',
                        avatar: 'https://via.placeholder.com/50',
                        openid: 'test_openid_123'
                    } : null
                });
            }, 100);
        });
    }
    
    // 处理二维码状态
    handleQRStatus(statusData) {
        if (!statusData) return;
        
        const qrContainer = document.getElementById('qrCode');
        
        switch (statusData.status) {
            case 'scanned':
                qrContainer.innerHTML = `
                    <i class="fas fa-mobile-alt" style="color: #52c41a; font-size: 48px; margin-bottom: 15px;"></i>
                    <p style="color: #52c41a;">扫码成功，请在手机上确认登录</p>
                `;
                break;
                
            case 'confirmed':
                this.handleLoginSuccess(statusData.userInfo);
                break;
                
            case 'expired':
                qrContainer.innerHTML = `
                    <i class="fas fa-clock" style="color: #ff6b6b; font-size: 48px; margin-bottom: 15px;"></i>
                    <p style="color: #ff6b6b;">二维码已过期</p>
                    <button onclick="qrLogin.generateQRCode()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">重新生成</button>
                `;
                clearInterval(this.refreshTimer);
                break;
        }
    }
    
    // 处理登录成功
    handleLoginSuccess(userInfo) {
        clearInterval(this.refreshTimer);
        
        const qrContainer = document.getElementById('qrCode');
        qrContainer.innerHTML = `
            <i class="fas fa-check-circle" style="color: #52c41a; font-size: 48px; margin-bottom: 15px;"></i>
            <p style="color: #52c41a;">登录成功！</p>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">欢迎，${userInfo.nickname}</p>
        `;
        
        // 触发登录成功事件
        window.dispatchEvent(new CustomEvent('loginSuccess', {
            detail: {
                provider: this.currentType,
                userInfo: userInfo
            }
        }));
    }
}

// 添加旋转动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// 全局二维码登录实例
window.qrLogin = new QRCodeLogin();