import React, { useState, useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=peaceful%20landscape%20with%20mountains%20and%20lake%2C%20serene%20nature%2C%20soft%20lighting%2C%20minimalist%20style&size=1024x576',
      title: '人生不过三万天',
      subtitle: '时间如白驹过隙，转瞬即逝'
    },
    {
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=old%20people%20holding%20hands%20in%20park%2C%20warm%20sunset%2C%20emotional%2C%20minimalist&size=1024x576',
      title: '珍惜身边的人',
      subtitle: '陪伴是最长情的告白'
    },
    {
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=person%20sitting%20quietly%20in%20nature%2C%20peaceful%20meditation%2C%20serene%20environment%2C%20minimalist&size=1024x576',
      title: '看淡功名利禄',
      subtitle: '简单的生活也能充满幸福'
    },
    {
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=family%20gathering%20at%20dinner%20table%2C%20warm%20lighting%2C%20happy%2C%20minimalist&size=1024x576',
      title: '活在当下',
      subtitle: '珍惜每一个平凡而美好的瞬间'
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [slides.length])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 12000) // 4 slides * 3 seconds each
    
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-center">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-center opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        
        {/* 进度指示器 */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
            ></div>
          ))}
        </div>
        
        {/* 跳过按钮 */}
        <button
          onClick={onComplete}
          className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
        >
          跳过
        </button>
      </div>
    </div>
  )
}

export default SplashScreen
