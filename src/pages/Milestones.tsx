import React, { useState } from 'react'
import { useLifeTrainStore } from '../store'
import { Calendar, Plus, Trash2 } from 'lucide-react'

const Milestones: React.FC = () => {
  const { milestones, addMilestone, removeMilestone } = useLifeTrainStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    addMilestone({
      title,
      description,
      date,
      importance: 3
    })
    setTitle('')
    setDescription('')
    setDate('')
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-12">人生节点</h1>
        
        {!showForm ? (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="minimal-button flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              添加节点
            </button>
          </div>
        ) : (
          <div className="minimal-card mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">添加人生节点</h2>
            <form onSubmit={handleAddMilestone} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="minimal-input"
                  placeholder="请输入事件标题"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="minimal-input"
                  placeholder="请输入事件描述"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="minimal-input"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-full text-lg font-normal hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button type="submit" className="flex-1 minimal-button">
                  添加
                </button>
              </div>
            </form>
          </div>
        )}

        {sortedMilestones.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>还没有添加人生节点</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200"></div>
            
            <div className="space-y-8">
              {sortedMilestones.map((milestone) => (
                <div key={milestone.id} className="relative pl-12">
                  <div className="absolute left-3.5 w-3 h-3 rounded-full bg-black -translate-x-1/2"></div>
                  
                  <div className="minimal-card">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold">{milestone.title}</h2>
                      <button
                        onClick={() => removeMilestone(milestone.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(milestone.date)}</span>
                    </div>
                    {milestone.description && (
                      <p className="text-gray-600">{milestone.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Milestones
