import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import EditorPage from './pages/EditorPage'
import { useEffect } from 'react'

function RequireAuth({ children }) {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      navigate('/auth')
    }
  }, [])

  return localStorage.getItem('userId') ? children : null
}

export default function App() {
  // 应用初始化时执行清理
  useEffect(() => {
    // 清除 localStorage
    localStorage.clear()
    
    // 清除 sessionStorage
    sessionStorage.clear()
    
    // 清除 indexedDB
    if (window.indexedDB) {
      window.indexedDB.databases().then(dbs => {
        dbs.forEach(db => {
          if (db.name) window.indexedDB.deleteDatabase(db.name)
        })
      })
    }
    
    // 清除 Service Worker 缓存
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName)
        })
      })
    }
  }, [])
  return (
    <EditorPage />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={
    //       <RequireAuth>
    //         <EditorPage />
    //       </RequireAuth>
    //     } />
    //     <Route path="/auth" element={<AuthPage />} />
    //   </Routes>
    // </BrowserRouter>
  )
}