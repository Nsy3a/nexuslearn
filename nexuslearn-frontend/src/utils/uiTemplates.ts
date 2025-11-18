export type UserType = 'beginner' | 'developer'
export type StyleType = 'modern' | 'professional'

export const UI_TEMPLATES: Record<UserType, Record<StyleType, string>> = {
  beginner: {
    modern: `
      <div class="generated-ui modern-beginner">
        <div class="ui-header">
          <h3>简单表单</h3>
          <p class="ui-desc">填写基本信息</p>
        </div>
        <div class="ui-body">
          <div class="form-group">
            <label>姓名</label>
            <input type="text" placeholder="请输入姓名" class="simple-input">
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" placeholder="请输入邮箱" class="simple-input">
          </div>
          <button class="submit-btn">提交</button>
        </div>
      </div>
    `,
    professional: `
      <div class="generated-ui professional-beginner">
        <div class="step-indicator">
          <div class="step active">1</div>
          <div class="step">2</div>
          <div class="step">3</div>
        </div>
        <div class="form-section">
          <h4>基本信息</h4>
          <div class="form-row">
            <div class="form-col">
              <label>姓名 *</label>
              <input type="text" required>
            </div>
            <div class="form-col">
              <label>年龄</label>
              <input type="number" min="1" max="120">
            </div>
          </div>
        </div>
      </div>
    `,
  },
  developer: {
    modern: `
      <div class="generated-ui modern-developer">
        <div class="ui-toolbar">
          <span class="toolbar-title">高级配置</span>
          <div class="toolbar-actions">
            <button class="btn-secondary">重置</button>
            <button class="btn-primary">保存配置</button>
          </div>
        </div>
        <div class="config-grid">
          <div class="config-item">
            <label>API Endpoint</label>
            <input type="text" value="https://api.example.com" class="config-input">
            <small>支持自定义API地址</small>
          </div>
          <div class="config-item">
            <label>超时时间 (ms)</label>
            <input type="number" value="30000" class="config-input">
            <small>请求超时设置</small>
          </div>
        </div>
      </div>
    `,
    professional: `
      <div class="generated-ui professional-developer">
        <div class="advanced-panel">
          <div class="panel-section">
            <h5>请求配置</h5>
            <div class="code-block">
              <pre>const config = {
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
};</pre>
            </div>
          </div>
          <div class="panel-section">
            <h5>错误处理</h5>
            <div class="error-handling">
              <label>
                <input type="checkbox" checked> 自动重试
              </label>
              <label>
                <input type="checkbox" checked> 显示详细错误
              </label>
            </div>
          </div>
        </div>
      </div>
    `,
  },
}