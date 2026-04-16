import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 类型定义
export interface User {
  name: string
  birthDate: string // YYYY-MM-DD
  lifeExpectancy: number
  createdAt: string
}

export interface FamilyMember {
  id: string
  name: string
  birthDate: string // YYYY-MM-DD
  lifeExpectancy: number
  createdAt: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  importance: number // 1-5
  createdAt: string
}

interface LifeTrainState {
  // 用户信息
  user: User | null
  setUser: (user: User) => void
  
  // 亲友列表
  familyMembers: FamilyMember[]
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => void
  updateFamilyMember: (id: string, member: Partial<Omit<FamilyMember, 'id' | 'createdAt'>>) => void
  removeFamilyMember: (id: string) => void
  
  // 人生节点
  milestones: Milestone[]
  addMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt'>) => void
  removeMilestone: (id: string) => void
  
  // 计算剩余天数
  calculateDaysLeft: (birthDate: string, lifeExpectancy: number) => number
  
  // 计算见面次数
  calculateMeetTimes: (familyMemberId: string, meetIntervalDays?: number) => number
  
  // 引导界面完成状态
  splashCompleted: boolean
  setSplashCompleted: (completed: boolean) => void
}

// 创建store
export const useLifeTrainStore = create<LifeTrainState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      familyMembers: [],
      milestones: [],
      splashCompleted: false,
      
      // 设置用户信息
      setUser: (user) => set({ user }),
      
      // 设置引导界面完成状态
      setSplashCompleted: (completed) => set({ splashCompleted: completed }),
      
      // 添加亲友
      addFamilyMember: (member) => set((state) => ({
        familyMembers: [...state.familyMembers, {
          ...member,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      // 修改亲友信息
      updateFamilyMember: (id, member) => set((state) => ({
        familyMembers: state.familyMembers.map(m => 
          m.id === id ? { ...m, ...member, updatedAt: new Date().toISOString() } : m
        )
      })),
      
      // 移除亲友
      removeFamilyMember: (id) => set((state) => ({
        familyMembers: state.familyMembers.filter(member => member.id !== id)
      })),
      
      // 添加人生节点
      addMilestone: (milestone) => set((state) => ({
        milestones: [...state.milestones, {
          ...milestone,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      
      // 移除人生节点
      removeMilestone: (id) => set((state) => ({
        milestones: state.milestones.filter(milestone => milestone.id !== id)
      })),
      
      // 计算剩余天数
      calculateDaysLeft: (birthDate, lifeExpectancy) => {
        const [y, m, d] = birthDate.split('-').map(Number)
        const birth = new Date(y, m - 1, d)
        const today = new Date()
        const death = new Date(y + lifeExpectancy, m - 1, d)
        
        const totalDays = Math.floor((death.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return Math.max(0, totalDays)
      },
      
      // 计算见面次数
      calculateMeetTimes: (familyMemberId, meetIntervalDays = 30) => {
        const state = get()
        if (!state.user) return 0
        
        const familyMember = state.familyMembers.find(m => m.id === familyMemberId)
        if (!familyMember) return 0
        
        // 计算用户剩余天数
        const userDaysLeft = state.calculateDaysLeft(state.user.birthDate, state.user.lifeExpectancy)
        // 计算亲友剩余天数
        const familyDaysLeft = state.calculateDaysLeft(familyMember.birthDate, familyMember.lifeExpectancy)
        
        // 取两者中的较小值
        const minDaysLeft = Math.min(userDaysLeft, familyDaysLeft)
        // 计算见面次数
        const meetTimes = Math.floor(minDaysLeft / meetIntervalDays)
        
        return Math.max(0, meetTimes)
      }
    }),
    {
      name: 'life-train-storage' // 本地存储的键名
    }
  )
)