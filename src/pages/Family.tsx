import React, { useState } from 'react'
import { useLifeTrainStore } from '../store'
import { Calendar, Clock, Plus, Trash2, Edit2 } from 'lucide-react'
import Timeline from '../components/Timeline'

const Family: React.FC = () => {
  const { familyMembers, addFamilyMember, removeFamilyMember, updateFamilyMember, calculateDaysLeft, calculateMeetTimes, user } = useLifeTrainStore()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [lifeExpectancy, setLifeExpectancy] = useState(80)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [meetIntervals, setMeetIntervals] = useState<Record<string, number>>({})
  const [editingMeetInterval, setEditingMeetInterval] = useState<number | null>(null)

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMember) {
      updateFamilyMember(editingMember, {
        name,
        birthDate,
        lifeExpectancy
      })
      if (editingMeetInterval !== null) {
        updateMeetInterval(editingMember, editingMeetInterval)
      }
      setEditingMember(null)
    } else {
      addFamilyMember({
        name,
        birthDate,
        lifeExpectancy
      })
      if (editingMeetInterval !== null) {
        updateMeetInterval(Date.now().toString(), editingMeetInterval)
      }
    }
    setName('')
    setBirthDate('')
    setLifeExpectancy(80)
    setEditingMeetInterval(null)
    setShowForm(false)
  }

  const handleEditMember = (member: any) => {
    setName(member.name)
    setBirthDate(member.birthDate)
    setLifeExpectancy(member.lifeExpectancy)
    setEditingMeetInterval(meetIntervals[member.id] || 30)
    setEditingMember(member.id)
    setShowForm(true)
  }

  const updateMeetInterval = (memberId: string, days: number) => {
    setMeetIntervals(prev => ({
      ...prev,
      [memberId]: days
    }))
  }

  const calculateCommonDays = (user: any, member: any) => {
    try {
      const now = new Date()
      const userBirth = new Date(user.birthDate)
      const memberBirth = new Date(member.birthDate)
      const laterBirth = new Date(Math.max(userBirth.getTime(), memberBirth.getTime()))
      
      const userDeath = new Date(userBirth)
      userDeath.setFullYear(userBirth.getFullYear() + user.lifeExpectancy)
      
      const memberDeath = new Date(memberBirth)
      memberDeath.setFullYear(memberBirth.getFullYear() + member.lifeExpectancy)
      
      const earlierDeath = new Date(Math.min(userDeath.getTime(), memberDeath.getTime()))
      const endDate = new Date(Math.min(now.getTime(), earlierDeath.getTime()))
      
      const msPerDay = 24 * 60 * 60 * 1000
      const days = Math.floor((endDate.getTime() - laterBirth.getTime()) / msPerDay)
      
      return Math.max(0, days)
    } catch (error) {
      return 0
    }
  }

  const calculateRemainingDays = (user: any, member: any) => {
    try {
      const now = new Date()
      const userBirth = new Date(user.birthDate)
      const memberBirth = new Date(member.birthDate)
      
      const userDeath = new Date(userBirth)
      userDeath.setFullYear(userBirth.getFullYear() + user.lifeExpectancy)
      
      const memberDeath = new Date(memberBirth)
      memberDeath.setFullYear(memberBirth.getFullYear() + member.lifeExpectancy)
      
      const earlierDeath = new Date(Math.min(userDeath.getTime(), memberDeath.getTime()))
      
      const msPerDay = 24 * 60 * 60 * 1000
      const days = Math.floor((earlierDeath.getTime() - now.getTime()) / msPerDay)
      
      return Math.max(0, days)
    } catch (error) {
      return 0
    }
  }

  const calculateMeetTimesWithInterval = (familyMemberId: string, meetIntervalDays: number) => {
    return calculateMeetTimes(familyMemberId, meetIntervalDays)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-medium">亲友</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          )}
        </div>
        
        {showForm && (
          <div className="minimal-card mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">{editingMember ? '修改亲友' : '添加亲友'}</h2>
            <form onSubmit={handleAddFamilyMember} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="minimal-input"
                  placeholder="请输入亲友姓名"
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">见面间隔天数 (默认30天)</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMeetInterval(Math.max(1, (editingMeetInterval || 30) - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={editingMeetInterval || 30}
                    onChange={(e) => setEditingMeetInterval(parseInt(e.target.value) || 30)}
                    className="w-20 text-center border border-gray-200 rounded-md py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingMeetInterval(Math.min(365, (editingMeetInterval || 30) + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">天</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingMeetInterval(null)
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-full text-lg font-normal hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button type="submit" className="flex-1 minimal-button">
                  {editingMember ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        )}

        {familyMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>还没有添加亲友</p>
          </div>
        ) : (
          <div className="space-y-4">
            {familyMembers.map((member) => {
              const daysLeft = calculateDaysLeft(member.birthDate, member.lifeExpectancy)
              const meetTimes = calculateMeetTimesWithInterval(member.id, meetIntervals[member.id] || 30)
              return (
                <div key={member.id} className="minimal-card">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold">{member.name}</h2>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeFamilyMember(member.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-8 mb-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-lg text-gray-400">剩余</div>
                      <div className="text-5xl font-light">{daysLeft}</div>
                      <div className="text-lg text-gray-400">天</div>
                    </div>
                    {user && (
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-lg text-gray-400">剩余可见</div>
                        <div className="text-5xl font-light">{meetTimes}</div>
                        <div className="text-lg text-gray-400">次</div>
                      </div>
                    )}
                  </div>
                  {user && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-600 mb-4">人生交集</h3>
                      <Timeline 
                        user={user} 
                        familyMember={member} 
                        enableZoom={false}
                      />
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">共同生活</span>
                          <span>{calculateCommonDays(user, member)} 天</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">剩余交集</span>
                          <span>{calculateRemainingDays(user, member)} 天</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Family
