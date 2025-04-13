import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/auth.css'

// 登录/注册页面组件
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 进入登录页时强制清除认证状态
  useEffect(() => {
    localStorage.removeItem('userId')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const endpoint = isLogin ? '/login' : '/register'
      const { data } = await axios.post(`http://localhost:5000/api${endpoint}`, {
        username,
        password
      })
      
      if (data.userId) {
        localStorage.setItem('userId', data.userId)
        navigate('/')
      }
    } catch (error) {
      alert(error.response?.data?.error || '请求失败')
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLogin ? '欢迎回来' : '创建账户'}
          </h1>
          <p className="text-gray-500">
            {isLogin ? '请登录以继续' : '开始你的3D创作之旅'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="text"
              className="auth-input"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="auth-input-label">用户名</label>
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              className="auth-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="auth-input-label">密码</label>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">处理中...</span>
            ) : isLogin ? '立即登录' : '注册账户'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? '新用户？' : '已有账户？'}
          <button
            className="auth-switch-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </div>
      </div>
    </div>
  )
}
