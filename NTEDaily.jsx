
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, Clock, LayoutDashboard, Settings, Trophy } from 'lucide-react';

const INITIAL_DAILY_TASKS = [
  { id: 'd1', text: '일일 로그인 및 출석 체크', completed: false, category: 'Daily' },
  { id: 'd2', text: '일일 의뢰(커미션) 4종 완료', completed: false, category: 'Daily' },
  { id: 'd3', text: '스테미나(활력) 소모', completed: false, category: 'Daily' },
  { id: 'd4', text: '도시 상점 일일 한정 아이템 구매', completed: false, category: 'Daily' },
  { id: 'd5', text: '차량 정비 및 세차 (버프 확인)', completed: false, category: 'Daily' },
];

const INITIAL_WEEKLY_TASKS = [
  { id: 'w1', text: '주간 보스 도전 완료', completed: false, category: 'Weekly' },
  { id: 'w2', text: '시뮬레이션 훈련 고득점 갱신', completed: false, category: 'Weekly' },
  { id: 'w3', text: '주간 배틀패스 포인트 정산', completed: false, category: 'Weekly' },
];

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('nte-tasks');
    return saved ? JSON.parse(saved) : [...INITIAL_DAILY_TASKS, ...INITIAL_WEEKLY_TASKS];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [activeTab, setActiveTab] = useState('Daily');
  const [timeLeft, setTimeLeft] = useState('');

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('nte-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer for reset (Simulated for 04:00 AM)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const resetTime = new Date();
      resetTime.setHours(4, 0, 0, 0);
      if (now > resetTime) resetTime.setDate(resetTime.getDate() + 1);
      
      const diff = resetTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      category: activeTab
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const resetCategory = () => {
    setTasks(tasks.map(task => 
      task.category === activeTab ? { ...task, completed: false } : task
    ));
  };

  const filteredTasks = tasks.filter(task => task.category === activeTab);
  const completedCount = filteredTasks.filter(t => t.completed).length;
  const progressPercent = filteredTasks.length > 0 ? (completedCount / filteredTasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              NTE Daily Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">Neverness to Everness Checklist</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <Clock className="text-blue-400 w-5 h-5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Next Reset In</p>
              <p className="text-sm font-mono text-emerald-400">{timeLeft}</p>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {['Daily', 'Weekly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {tab === 'Daily' ? <LayoutDashboard size={18} /> : <Calendar size={18} />}
              {tab === 'Daily' ? '일간' : '주간'}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                {activeTab === 'Daily' ? '일일 목표' : '주간 목표'}
              </h2>
              <p className="text-slate-500 text-sm">{completedCount} / {filteredTasks.length} 완료됨</p>
            </div>
            <button 
              onClick={resetCategory}
              className="text-xs text-slate-400 hover:text-red-400 underline decoration-slate-600"
            >
              전체 초기화
            </button>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3 mb-8">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  task.completed 
                  ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                  : 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  {task.completed ? (
                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                  ) : (
                    <Circle className="text-slate-600 w-6 h-6 group-hover:text-blue-400" />
                  )}
                  <span className={`text-sm md:text-base ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.text}
                  </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                  className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-500">등록된 항목이 없습니다.</p>
            </div>
          )}
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="relative">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={`새로운 ${activeTab === 'Daily' ? '일간' : '주간'} 할 일 추가...`}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-5 pr-14 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>

        <footer className="mt-12 text-center">
          <p className="text-slate-600 text-[11px] uppercase tracking-[0.2em]">
            System Status: Operational // Local Storage Active
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;