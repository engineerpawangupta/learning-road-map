'use client';

import { motion } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  path: string;
  completed: boolean;
  position: { x: number; y: number };
}

interface LessonNodeProps {
  lesson: Lesson;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function LessonNode({ lesson, index, isActive, onClick }: LessonNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`relative w-20 h-20 rounded-full cursor-pointer flex items-center justify-center transition-all
          ${lesson.completed 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
            : isActive 
              ? 'bg-white' 
              : 'bg-gray-500'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        aria-label={`Lesson: ${lesson.title}`}
        role="button"
        tabIndex={0}
      >
        {lesson.completed ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className={`text-lg font-bold ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
            {index + 1}
          </span>
        )}
        <span className="absolute -top-2 right-0 bg-amber-400 text-xs font-bold px-2 py-1 rounded-full">
          Introduction to python
        </span>
      </motion.div>
      <div className="mt-2 max-w-[200px] text-center">
        <p className="font-bold text-sm">{lesson.title}</p>
      </div>
    </div>
  );
} 