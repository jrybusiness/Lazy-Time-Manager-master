import React, { useEffect, useRef } from 'react';
import type { Task } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskTracker from './components/TaskTracker';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  // State for the Task Tracker feature, persisted in localStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('willpower-tasks', []);
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to ensure browser compatibility.
  const notificationTimeouts = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Helper function to check if task is checked in today
  const isCheckedInToday = (lastCheckedIn: string | null): boolean => {
      if (!lastCheckedIn) return false;
      return new Date(lastCheckedIn).toDateString() === new Date().toDateString();
  };

  // Effect to handle scheduling notifications
  useEffect(() => {
    // Clear all previous timeouts whenever tasks change to avoid duplicates
    notificationTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    notificationTimeouts.current.clear();

    if ('Notification' in window && Notification.permission === 'granted') {
      tasks.forEach(task => {
        // Don't schedule for tasks already checked in today
        if (isCheckedInToday(task.lastCheckedIn)) {
            return;
        }

        const now = new Date();
        const [hours, minutes] = task.reminderTime.split(':').map(Number);
        
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        // Schedule only if the reminder time is in the future for today
        if (reminderDate > now) {
          const timeToReminder = reminderDate.getTime() - now.getTime();
          
          const timeoutId = setTimeout(() => {
            new Notification('每日任務提醒', {
              body: `「${task.name}」的時間到了！`,
              icon: '/favicon.svg',
              tag: `task-notification-${task.id}` // Use a tag to prevent duplicate notifications
            });
            notificationTimeouts.current.delete(task.id);
          }, timeToReminder);

          notificationTimeouts.current.set(task.id, timeoutId);
        }
      });
    }
    
    // Cleanup function to clear timeouts when the component unmounts
    return () => {
      notificationTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [tasks]); // This effect re-runs whenever the list of tasks changes.

  const handleAddTask = (name: string, reminderTime: string, deadlineTime: string) => {
    const newTask: Task = {
        id: Date.now(),
        name,
        reminderTime,
        deadlineTime,
        lastCheckedIn: null,
        streak: 0,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleToggleCheckin = (taskId: number) => {
    setTasks(prevTasks => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        return prevTasks.map(task => {
            if (task.id === taskId) {
                const lastCheckinDate = task.lastCheckedIn ? new Date(task.lastCheckedIn) : null;
                // Prevent checking in more than once a day
                if (lastCheckinDate && lastCheckinDate.toDateString() === today.toDateString()) {
                    return task;
                }
                
                const newStreak = lastCheckinDate && lastCheckinDate.toDateString() === yesterday.toDateString()
                    ? task.streak + 1
                    : 1;
                
                return { ...task, lastCheckedIn: today.toISOString(), streak: newStreak };
            }
            return task;
        });
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <TaskTracker
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleCheckin={handleToggleCheckin}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;