import React, { useState, useEffect, useMemo } from 'react';
import type { Task } from '../types';
import Card from './common/Card';
import TrashIcon from './icons/TrashIcon';
import FlameIcon from './icons/FlameIcon';

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggleCheckin: (id: number) => void;
}

const isCheckedInToday = (lastCheckedIn: string | null): boolean => {
    if (!lastCheckedIn) return false;
    return new Date(lastCheckedIn).toDateString() === new Date().toDateString();
};

interface CountdownProps {
  targetTime: string; // "HH:MM"
}

const Countdown: React.FC<CountdownProps> = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            // Fix: Corrected Date object instantiation from `new new Date()` to `new Date()`.
            const target = new Date();
            const [hours, minutes] = targetTime.split(':').map(Number);
            target.setHours(hours, minutes, 59, 999); // Set to end of minute
            return target.getTime() - now.getTime();
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    if (timeLeft <= 0) {
        return null; // Parent component will handle the "missed" state
    }

    const hours = String(Math.floor(timeLeft / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, '0');
    
    const isUrgent = timeLeft < 3600000; // Less than 1 hour
    const colorClass = isUrgent ? 'text-red-500' : 'text-gray-500 dark:text-gray-400';

    return (
        <div className="text-center">
            <div className={`text-2xl font-mono tracking-tighter font-bold ${colorClass}`}>
                {`${hours}:${minutes}:${seconds}`}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">剩餘時間</div>
        </div>
    );
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleCheckin }) => {
    const checkedInToday = useMemo(() => isCheckedInToday(task.lastCheckedIn), [task.lastCheckedIn]);

    const deadlineDate = useMemo(() => {
        const deadline = new Date();
        const [hours, minutes] = task.deadlineTime.split(':').map(Number);
        deadline.setHours(hours, minutes, 59, 999);
        return deadline;
    }, [task.deadlineTime]);

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // This timer ensures the component re-renders to check if the deadline has passed
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const deadlineHasPassed = now > deadlineDate;

    const getStatusDisplay = () => {
        if (checkedInToday) {
            return (
                <div className="text-center">
                    <div className="text-lg font-bold text-green-500">已完成!</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">做得好</div>
                </div>
            );
        }
        if (deadlineHasPassed) {
            return (
                <div className="text-center">
                    <div className="text-lg font-bold text-red-500">已錯過</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">明天再試</div>
                </div>
            );
        }
        return <Countdown targetTime={task.deadlineTime} />;
    };

    const isTaskDisabled = checkedInToday || deadlineHasPassed;

    return (
        <Card className={`p-4 flex items-center space-x-4 transition-opacity ${isTaskDisabled && !checkedInToday ? 'opacity-60' : ''}`}>
            <input
                type="checkbox"
                checked={checkedInToday}
                onChange={() => onToggleCheckin(task.id)}
                disabled={isTaskDisabled}
                className="h-8 w-8 rounded-full text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Mark ${task.name} as complete for today`}
            />
            <div className="flex-grow">
                <p className={`font-medium ${isTaskDisabled ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                    {task.name}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2 flex-wrap">
                    <span>提醒: {task.reminderTime}</span>
                    <span>/</span>
                    <span>截止: {task.deadlineTime}</span>
                    {task.streak > 0 && (
                        <span className={`flex items-center font-bold ${task.streak > 0 ? 'text-orange-500' : ''} pt-1 sm:pt-0`}>
                            <FlameIcon />
                            <span>{task.streak} 天</span>
                        </span>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0 w-28">
                {getStatusDisplay()}
            </div>
            <button 
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Delete task ${task.name}`}
                >
                <TrashIcon />
            </button>
        </Card>
    );
};

export default TaskItem;