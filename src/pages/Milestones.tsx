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
    <div className="fade-in h-full flex flex-col overflow-hidden">
      <div className="max-w-3xl mx-auto h-full flex flex-col overflow-hidden">
        <h1 className="text-xl font-semibold text-center mb-4 flex-shrink-0">人生节点</h1>
        
        {!showForm ? (
          <div className="text-center mb-4 flex-shrink-0">
            <button
              onClick={() => setShowForm(true)}
              className="minimal-button flex items-center gap-2 mx-auto py-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              添加节点
            </button>
          </div>
        ) : (
          <div className="minimal-card mb-4 p-4 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-4 text-center">添加人生节点</h2>
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="minimal-input text-sm py-2"
                  placeholder="请输入事件标题"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="minimal-input text-sm py-2"
                  placeholder="请输入事件描述"
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="minimal-input text-sm py-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-full text-sm font-normal hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button type="submit" className="flex-1 minimal-button py-2 text-sm">
                  添加
                </button>
              </div>
            </form>
          </div>
        )}

        {sortedMilestones.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-gray-400">
            <p className="text-sm">还没有添加人生节点</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-1 -mr-1 relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200"></div>
            
            <div className="space-y-4">
              {sortedMilestones.map((milestone) => (
                <div key={milestone.id} className="relative pl-10">
                  <div className="absolute left-3 w-2.5 h-2.5 rounded-full bg-black -translate-x-1/2"></div>
                  
                  <div className="minimal-card p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-base font-semibold">{milestone.title}</h2>
                      <button
                        onClick={() => removeMilestone(milestone.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(milestone.date)}</span>
                    </div>
                    {milestone.description && (
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
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
