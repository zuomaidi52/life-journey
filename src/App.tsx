import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Family from './pages/Family'
import Milestones from './pages/Milestones'
import SplashScreen from './components/SplashScreen'
import { Train, Users, Calendar } from 'lucide-react'
import { useLifeTrainStore } from './store'

function App() {
  const location = useLocation()
  const { splashCompleted, setSplashCompleted } = useLifeTrainStore()

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
    <div className="h-screen w-screen journey-bg flex flex-col overflow-hidden">
      <div className="train-window-bg"></div>
      
      <main className="container mx-auto px-4 py-3 flex-grow train-interior overflow-hidden flex flex-col">
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/family" element={<Family />} />
            <Route path="/milestones" element={<Milestones />} />
          </Routes>
        </div>
      </main>

      <nav className="bg-transparent py-2 flex-shrink-0">
        <div className="container mx-auto flex justify-center items-center gap-8">
          <NavLink 
            to="/" 
            icon={<Train className="w-5 h-5" />} 
            active={isActive('/')}
          />
          <NavLink 
            to="/family" 
            icon={<Users className="w-5 h-5" />} 
            active={isActive('/family')}
          />
          <NavLink 
            to="/milestones" 
            icon={<Calendar className="w-5 h-5" />} 
            active={isActive('/milestones')}
          />
        </div>
      </nav>
    </div>
  )
}

function NavLink({ 
  to, 
  icon, 
  active 
}: { 
  to: string
  icon: React.ReactNode
  active: boolean
}) {
  return (
    <Link 
      to={to} 
      className={`transition-all duration-200 ${
        active 
          ? 'text-black' 
          : 'text-gray-300 hover:text-gray-500'
      }`}
    >
      {icon}
    </Link>
  )
}

export default App
