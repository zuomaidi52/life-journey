import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Family from './pages/Family'
import Milestones from './pages/Milestones'
import SplashScreen from './components/SplashScreen'
import { Train, Users, Calendar, Menu, X, Settings } from 'lucide-react'
import { useLifeTrainStore } from './store'

function App() {
  const location = useLocation()
  const { splashCompleted, setSplashCompleted } = useLifeTrainStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleSplashComplete = () => {
    setSplashCompleted(true)
  }

  if (!splashCompleted) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="min-h-screen journey-bg flex flex-col">
      <div className="train-window-bg"></div>
      
      {/* 侧边菜单按钮 */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* 侧边菜单 */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-xl z-40 transition-transform duration-300 ease-in-out ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">菜单</h2>
          <div className="space-y-4">
            <NavLink 
              to="/" 
              icon={<Train className="w-5 h-5 mr-3" />} 
              active={isActive('/')}
              onClick={() => setMenuOpen(false)}
              label="首页"
            />
            <NavLink 
              to="/family" 
              icon={<Users className="w-5 h-5 mr-3" />} 
              active={isActive('/family')}
              onClick={() => setMenuOpen(false)}
              label="亲友"
            />
            <NavLink 
              to="/milestones" 
              icon={<Calendar className="w-5 h-5 mr-3" />} 
              active={isActive('/milestones')}
              onClick={() => setMenuOpen(false)}
              label="人生节点"
            />
            <div className="border-t border-gray-100 pt-4 mt-4">
              <Link 
                to="/" 
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = '/' // 刷新页面回到首页表单
                  setMenuOpen(false)
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>修改信息</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-4 flex-grow train-interior">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/family" element={<Family />} />
          <Route path="/milestones" element={<Milestones />} />
        </Routes>
      </main>
    </div>
  )
}

function NavLink({ 
  to, 
  icon, 
  active, 
  onClick,
  label
}: { 
  to: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center transition-all duration-200 py-2 px-3 rounded-lg ${
        active 
          ? 'bg-gray-100 text-black' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default App
