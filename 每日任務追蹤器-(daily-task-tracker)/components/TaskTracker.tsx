import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import TaskItem from './TaskItem';

interface TaskTrackerProps {
  tasks: Task[];
  onAddTask: (name: string, reminderTime: string, deadlineTime: string) => void;
  onDeleteTask: (id: number) => void;
  onToggleCheckin: (id: number) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onAddTask, onDeleteTask, onToggleCheckin }) => {
  const [taskName, setTaskName] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState('Notification' in window ? Notification.permission : 'denied');

  // This effect will keep the permission state in sync if the user changes it in browser settings
  useEffect(() => {
    if (!('Notification' in window)) {
      return;
    }
    const checkPermission = () => {
      if (Notification.permission !== notificationPermission) {
        setNotificationPermission(Notification.permission);
      }
    };
    const intervalId = setInterval(checkPermission, 1000);
    document.addEventListener('visibilitychange', checkPermission);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', checkPermission);
    };
  }, [notificationPermission]);

  const handleRequestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError('任務名稱不可為空！');
      return;
    }
    setError(null);
    onAddTask(taskName, reminderTime, deadlineTime);
    setTaskName('');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          {notificationPermission === 'default' && (
            <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 mb-4 rounded-r-lg" role="alert">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">啟用任務提醒</p>
                  <p className="text-sm">允許通知以便在任務時間到達時收到提醒。</p>
                </div>
                <button onClick={handleRequestPermission} className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                  允許
                </button>
              </div>
            </div>
          )}
          {notificationPermission === 'denied' && tasks.length > 0 && (
              <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 mb-4 rounded-r-lg text-sm" role="alert">
                <p className="font-bold">提醒已封鎖</p>
                <p className="mt-1">要啟用提醒，請點擊瀏覽器網址列旁的鎖頭 (🔒) 圖示，並在網站設定中將「通知」權限設定為「允許」。</p>
                <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
                    💡 提示：啟用後，即使您關閉此分頁，提醒仍會在指定時間發送。
                </p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">建立每日習慣</h2>
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm" role="alert"><p>{error}</p></div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">習慣名稱</label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="例如：冥想 10 分鐘"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">提醒時間</label>
                <input
                  type="time"
                  id="reminderTime"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="deadlineTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">每日截止時間</label>
                <input
                  type="time"
                  id="deadlineTime"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <Button type="submit" fullWidth>
              新增習慣
            </Button>
          </form>
        </div>
      </Card>
      
      {tasks.length > 0 ? (
        <div className="space-y-3">
             {tasks.sort((a, b) => a.deadlineTime.localeCompare(b.deadlineTime)).map(task => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    onDelete={onDeleteTask}
                    onToggleCheckin={onToggleCheckin}
                />
             ))}
        </div>
      ) : (
         <Card>
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">尚未建立任何習慣。</p>
                <p className="mt-2">開始新增你的第一個每日習慣吧！</p>
            </div>
        </Card>
      )}
    </div>
  );
};

export default TaskTracker;