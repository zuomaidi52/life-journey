import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Family from './pages/Family'
import Milestones from './pages/Milestones'
import SplashScreen from './components/SplashScreen'
import { Train, Users, Calendar, Edit2, Plus } from 'lucide-react'
import { useLifeTrainStore } from './store'

interface ModifyContextType {
  showHomeForm: boolean
  setShowHomeForm: (show: boolean) => void
  showFamilyForm: boolean
  setShowFamilyForm: (show: boolean) => void
  showMilestonesForm: boolean
  setShowMilestonesForm: (show: boolean) => void
}

const ModifyContext = createContext<ModifyContextType | undefined>(undefined)

export const useModifyContext = () => {
  const context = useContext(ModifyContext)
  if (!context) {
    throw new Error('useModifyContext must be used within a ModifyProvider')
  }
  return context
}

function App() {
  const location = useLocation()
  const { splashCompleted, setSplashCompleted } = useLifeTrainStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showHomeForm, setShowHomeForm] = useState(false)
  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const [showMilestonesForm, setShowMilestonesForm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleSplashComplete = () => {
    setSplashCompleted(true)
  }

  const handleModifyHome = () => {
    setShowHomeForm(true)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleModifyFamily = () => {
    setShowFamilyForm(true)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleModifyMilestones = () => {
    setShowMilestonesForm(true)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  if (!splashCompleted) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <ModifyContext.Provider value={{ 
      showHomeForm, 
      setShowHomeForm, 
      showFamilyForm, 
      setShowFamilyForm, 
      showMilestonesForm, 
      setShowMilestonesForm 
    }}>
      <div className="min-h-screen journey-bg flex flex-col">
        <div className="train-window-bg"></div>
        
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed top-5 right-5 z-50 w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
        >
          <span className={`block h-[1.5px] w-5 bg-gray-800 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3.25px]' : ''}`} />
          <span className={`block h-[1.5px] w-5 bg-gray-800 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`block h-[1.5px] w-5 bg-gray-800 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3.25px]' : ''}`} />
        </button>

        <div ref={menuRef} className={`fixed top-14 right-4 z-40 transition-all duration-300 ease-out ${
          menuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 min-w-[180px]">
            <NavLink 
              to="/" 
              icon={<Train className="w-4 h-4" />} 
              active={isActive('/')}
              onClick={() => setMenuOpen(false)}
              label="首页"
            />
            <NavLink 
              to="/family" 
              icon={<Users className="w-4 h-4" />} 
              active={isActive('/family')}
              onClick={() => setMenuOpen(false)}
              label="亲友"
            />
            <NavLink 
              to="/milestones" 
              icon={<Calendar className="w-4 h-4" />} 
              active={isActive('/milestones')}
              onClick={() => setMenuOpen(false)}
              label="人生节点"
            />
            <div className="h-px bg-gray-100 my-1.5 mx-3" />
            <MenuButton
              onClick={handleModifyHome}
              icon={<Edit2 className="w-3.5 h-3.5" />}
              label="修改个人信息"
            />
            <MenuButton
              onClick={handleModifyFamily}
              icon={<Plus className="w-3.5 h-3.5" />}
              label="添加/修改亲友"
            />
            <MenuButton
              onClick={handleModifyMilestones}
              icon={<Plus className="w-3.5 h-3.5" />}
              label="添加/修改节点"
            />
          </div>
        </div>

        <main className="container mx-auto px-4 py-4 flex-grow train-interior">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/family" element={<Family />} />
            <Route path="/milestones" element={<Milestones />} />
          </Routes>
        </main>
      </div>
    </ModifyContext.Provider>
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
      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        active 
          ? 'text-black font-medium' 
          : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function MenuButton({
  onClick,
  icon,
  label
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-full text-left"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default App
