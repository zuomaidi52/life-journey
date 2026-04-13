import React, { useState } from 'react'

interface TimelineProps {
  user: {
    birthDate: string
    lifeExpectancy: number
    name: string
  }
  familyMember: {
    birthDate: string
    lifeExpectancy: number
    name: string
  }
  enableZoom?: boolean
}

const Timeline: React.FC<TimelineProps> = ({ user, familyMember, enableZoom = true }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  
  // 计算时间范围
  const userBirth = new Date(user.birthDate)
  const userDeath = new Date(userBirth)
  userDeath.setFullYear(userBirth.getFullYear() + user.lifeExpectancy)
  
  const memberBirth = new Date(familyMember.birthDate)
  const memberDeath = new Date(memberBirth)
  memberDeath.setFullYear(memberBirth.getFullYear() + familyMember.lifeExpectancy)
  
  // 判断谁年纪大，年纪大的在上面
  const userIsOlder = userBirth < memberBirth
  
  // 计算时间轴范围
  const startDate = new Date(Math.min(userBirth.getTime(), memberBirth.getTime()))
  const endDate = new Date(Math.max(userDeath.getTime(), memberDeath.getTime()))
  
  // 计算总时间跨度（年）
  const totalYears = endDate.getFullYear() - startDate.getFullYear()
  
  // 处理双击事件
  const handleDoubleClick = () => {
    if (enableZoom) {
      if (!isZoomed) {
        // 放大时，以当前时间为中心
        const centerPosition = currentPosition - (50 / 3)
        setScrollPosition(Math.max(0, Math.min(100 - (100 / 3), centerPosition)))
        setZoomLevel(3)
      } else {
        // 缩小时重置
        setScrollPosition(0)
        setZoomLevel(1)
      }
      setIsZoomed(!isZoomed)
    }
  }
  
  // 处理拖动开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (enableZoom && isZoomed) {
      setIsDragging(true)
      setDragStart(e.clientX)
    }
  }
  
  // 处理拖动移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const delta = (e.clientX - dragStart) / zoomLevel
      setScrollPosition(prev => {
        const newPos = prev + delta
        return Math.max(0, Math.min(100 - (100 / zoomLevel), newPos))
      })
      setDragStart(e.clientX)
    }
  }
  
  // 处理拖动结束
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // 处理进度条变化
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrollPosition(parseFloat(e.target.value))
  }
  
  // 计算各个时间点的位置百分比
  const getUserStartPosition = () => {
    const yearsFromStart = userBirth.getFullYear() - startDate.getFullYear()
    const position = (yearsFromStart / totalYears) * 100
    return (position - scrollPosition) * zoomLevel
  }
  
  const getUserEndPosition = () => {
    const yearsFromStart = userDeath.getFullYear() - startDate.getFullYear()
    const position = (yearsFromStart / totalYears) * 100
    return (position - scrollPosition) * zoomLevel
  }
  
  const getMemberStartPosition = () => {
    const yearsFromStart = memberBirth.getFullYear() - startDate.getFullYear()
    const position = (yearsFromStart / totalYears) * 100
    return (position - scrollPosition) * zoomLevel
  }
  
  const getMemberEndPosition = () => {
    const yearsFromStart = memberDeath.getFullYear() - startDate.getFullYear()
    const position = (yearsFromStart / totalYears) * 100
    return (position - scrollPosition) * zoomLevel
  }
  
  // 计算交集区域
  const getIntersectionStart = () => {
    return Math.max(getUserStartPosition(), getMemberStartPosition())
  }
  
  const getIntersectionEnd = () => {
    return Math.min(getUserEndPosition(), getMemberEndPosition())
  }
  
  const intersectionWidth = Math.max(0, getIntersectionEnd() - getIntersectionStart())
  
  // 计算当前年份的位置
  const currentYear = new Date().getFullYear()
  const currentPosition = ((currentYear - startDate.getFullYear()) / totalYears) * 100
  const currentPositionZoomed = (currentPosition - scrollPosition) * zoomLevel
  
  return (
    <div className="w-full">
      {/* 时间轴标题 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${userIsOlder ? 'bg-black' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">{userIsOlder ? user.name : familyMember.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${userIsOlder ? 'bg-gray-400' : 'bg-black'}`}></div>
          <span className="text-sm font-medium">{userIsOlder ? familyMember.name : user.name}</span>
        </div>
      </div>
      
      {/* 时间轴 */}
      <div 
        className={`relative h-20 w-full ${enableZoom ? 'cursor-pointer' : ''}`}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 背景轨道 */}
        <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
        <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
        
        {/* 交集区域 */}
        {intersectionWidth > 0 && (
          <div 
            className={`absolute top-0 bottom-0 rounded-lg transition-all duration-200 cursor-pointer ${
              hoveredSection === 'intersection' ? 'bg-blue-200' : 'bg-blue-100'
            }`}
            style={{
              left: `${getIntersectionStart()}%`,
              width: `${intersectionWidth}%`
            }}
            onMouseEnter={() => setHoveredSection('intersection')}
            onMouseLeave={() => setHoveredSection(null)}
            title="人生交集"
          ></div>
        )}
        
        {/* 上面的时间轴 */}
        <div 
          className={`absolute top-1/4 h-3 rounded-full transform -translate-y-1/2 transition-all duration-200 cursor-pointer ${
            hoveredSection === 'top' ? 'bg-gray-800 scale-y-125' : (userIsOlder ? 'bg-black' : 'bg-gray-400')
          }`}
          style={{
            left: `${userIsOlder ? getUserStartPosition() : getMemberStartPosition()}%`,
            width: `${userIsOlder ? getUserEndPosition() - getUserStartPosition() : getMemberEndPosition() - getMemberStartPosition()}%`
          }}
          onMouseEnter={() => setHoveredSection('top')}
          onMouseLeave={() => setHoveredSection(null)}
          title={`${userIsOlder ? user.name : familyMember.name}的人生`}
        ></div>
        
        {/* 下面的时间轴 */}
        <div 
          className={`absolute top-3/4 h-3 rounded-full transform -translate-y-1/2 transition-all duration-200 cursor-pointer ${
            hoveredSection === 'bottom' ? 'bg-gray-600 scale-y-125' : (userIsOlder ? 'bg-gray-400' : 'bg-black')
          }`}
          style={{
            left: `${userIsOlder ? getMemberStartPosition() : getUserStartPosition()}%`,
            width: `${userIsOlder ? getMemberEndPosition() - getMemberStartPosition() : getUserEndPosition() - getUserStartPosition()}%`
          }}
          onMouseEnter={() => setHoveredSection('bottom')}
          onMouseLeave={() => setHoveredSection(null)}
          title={`${userIsOlder ? familyMember.name : user.name}的人生`}
        ></div>
        
        {/* 当前时间标记 */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-1/2"
          style={{ left: `${isZoomed ? currentPositionZoomed : currentPosition}%` }}
        >
          <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-500 rounded-full transform -translate-y-1/2 border-2 border-white"></div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">
            {currentYear}
          </div>
        </div>
        
        {/* 时间标签 */}
        <div className="absolute top-full left-0 mt-2 text-xs text-gray-500">
          {startDate.getFullYear()}
        </div>
        <div className="absolute top-full right-0 mt-2 text-xs text-gray-500">
          {endDate.getFullYear()}
        </div>
        
        {/* 密集时间刻度（放大时显示） */}
        {enableZoom && isZoomed && (
          <div className="absolute top-full left-0 right-0 mt-6 flex justify-between">
            {Array.from({ length: Math.min(10, totalYears) }).map((_, index) => {
              const year = startDate.getFullYear() + Math.floor((totalYears / 10) * index)
              return (
                <div key={index} className="text-xs text-gray-400">
                  {year}
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      {/* 进度条（放大时显示） */}
      {enableZoom && isZoomed && (
        <div className="mt-12">
          <input
            type="range"
            min="0"
            max={100 - (100 / zoomLevel)}
            value={scrollPosition}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0071e3 ${(scrollPosition / (100 - (100 / zoomLevel))) * 100}%, #e5e7eb ${(scrollPosition / (100 - (100 / zoomLevel))) * 100}%`
            }}
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{startDate.getFullYear()}</span>
            <span>{endDate.getFullYear()}</span>
          </div>
        </div>
      )}
      
      {/* 时间轴说明 */}
      <div className="mt-6 text-[10px] text-gray-400">
        <p>时间轴展示了您与{familyMember.name}的人生轨迹，蓝色区域表示你们的人生交集</p>
        {enableZoom && (
          <p className="mt-1">双击时间轴可放大查看，拖动可左右移动</p>
        )}
      </div>
    </div>
  )
}

export default Timeline
