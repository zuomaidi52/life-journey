import React, { useState, useEffect } from 'react'
import { useLifeTrainStore } from '../store'

const quotes = [
  "人生就像一场列车旅行，每个人都有自己的终点站。",
  "到站了就下车，不必悲伤，因为每个人都有自己的路要走。",
  "珍惜当下的每一刻，因为它们都是生命中独一无二的风景。",
  "人生的意义不在于目的地，而在于沿途的风景。",
  "当亲友到站下车时，好好告别，因为相遇已是缘分。",
  "思念是对过去最好的纪念，而不是对现在的束缚。",
  "每个人的生命都有其独特的价值，无论长短。",
  "活在当下，因为这是你唯一能真正拥有的时刻。"
]

const Home: React.FC = () => {
  const { user, setUser, calculateDaysLeft } = useLifeTrainStore()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [lifeExpectancy, setLifeExpectancy] = useState(80)
  const [daysLeft, setDaysLeft] = useState(0)
  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)])
  const [showForm, setShowForm] = useState(!user)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (user) {
      const timer = setInterval(() => {
        const now = new Date()
        const birth = new Date(user.birthDate)
        const death = new Date(birth)
        death.setFullYear(birth.getFullYear() + user.lifeExpectancy)
        
        const totalMs = death.getTime() - now.getTime()
        if (totalMs > 0) {
          const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((totalMs % (1000 * 60)) / 1000)
          setTimeLeft({ hours, minutes, seconds })
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      const days = calculateDaysLeft(user.birthDate, user.lifeExpectancy)
      setDaysLeft(days)
    }
  }, [user, calculateDaysLeft])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({
      name,
      birthDate,
      lifeExpectancy,
      createdAt: new Date().toISOString()
    })
    setShowForm(false)
  }

  return (
    <div className="fade-in">
      {showForm ? (
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-semibold text-center mb-2">人生不过三万天</h1>
          <p className="text-center text-gray-500 mb-12">开始记录你的人生旅程</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="minimal-input"
                placeholder="请输入您的姓名"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">出生日期</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="minimal-input"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">预期寿命 (默认80岁)</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                min="1"
                max="120"
                className="minimal-input"
              />
            </div>
            
            <button type="submit" className="w-full minimal-button">
              开始旅程
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto h-screen flex flex-col justify-center items-center px-4 py-4">
          <h1 className="text-lg font-medium text-center mb-3">{user?.name}的人生</h1>
          
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <div className="text-base text-gray-400">剩余</div>
              <div className="text-8xl md:text-[10rem] lg:text-[12rem] font-light tracking-tighter focus-element">
                {daysLeft}
              </div>
              <div className="text-base text-gray-400">天</div>
            </div>
            <div className="flex justify-center gap-1 text-[10px] text-gray-400 mt-2">
              <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-base md:text-lg text-gray-500 font-light leading-relaxed max-w-lg mx-auto">"{currentQuote}"</p>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors"
            >
              修改信息
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
