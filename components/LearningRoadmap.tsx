'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LessonNode from './LessonNode';
import Toast from './Toast';
import { motion } from 'framer-motion';

// Define lesson data structure
interface Lesson {
  id: string;
  title: string;
  path: string;
  completed: boolean;
  position: { x: number; y: number };
}

export default function LearningRoadmap() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [userPosition, setUserPosition] = useState(0);
  
  useEffect(() => {
    // Define the lessons
    const defaultLessons: Lesson[] = [
      {
        id: 'intro',
        title: 'Introduction to Python',
        path: '/blog/introduction-to-python',
        completed: false,
        position: { x: 0, y: 0 }
      },
      {
        id: 'step-by-step',
        title: 'How to Learn Python Step by Step',
        path: '/blog/python-step-by-step',
        completed: false,
        position: { x: -120, y: 120 }
      },
      {
        id: 'data-python',
        title: 'Complete Tutorial: Learn Data Python from Scratch',
        path: '/blog/data-python-tutorial',
        completed: false,
        position: { x: 120, y: 240 }
      },
      // Add more lessons as needed
      {
        id: 'lorem1',
        title: 'Lorem ipsum dior siet',
        path: '/blog/lorem1',
        completed: false,
        position: { x: 0, y: 360 }
      },
      {
        id: 'lorem2',
        title: 'Lorem ipsum dior siet',
        path: '/blog/lorem2',
        completed: false,
        position: { x: 0, y: 480 }
      },
      {
        id: 'lorem3',
        title: 'Lorem ipsum dior siet',
        path: '/blog/lorem3',
        completed: false,
        position: { x: 0, y: 600 }
      },
    ];

    // Only access localStorage after component mounts (client-side only)
    const loadProgress = () => {
      const savedProgress = localStorage.getItem('pythonLessonsProgress');
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          // Calculate user position based on completed lessons
          const completedCount = parsedProgress.filter((lesson: Lesson) => lesson.completed).length;
          setUserPosition(completedCount);
          return parsedProgress;
        } catch (e) {
          console.error("Failed to parse saved progress", e);
        }
      }
      return defaultLessons;
    };

    setLessons(loadProgress());
  }, []); // Empty dependency array ensures this runs only once after mount

  // Save progress to localStorage whenever lessons change
  useEffect(() => {
    if (lessons.length > 0) {
      localStorage.setItem('pythonLessonsProgress', JSON.stringify(lessons));
    }
  }, [lessons]);

  const handleLessonClick = (lesson: Lesson) => {
    // Find the index of the clicked lesson
    const lessonIndex = lessons.findIndex(l => l.id === lesson.id);
    
    // Check if this lesson is accessible (all previous lessons must be completed)
    const canAccess = lessonIndex === 0 || lessons[lessonIndex - 1].completed;
    
    if (canAccess) {
      // Mark as completed and update state
      const updatedLessons = [...lessons];
      updatedLessons[lessonIndex].completed = true;
      setLessons(updatedLessons);
      
      // Update user position if this is the furthest completed lesson
      if (lessonIndex >= userPosition) {
        setUserPosition(lessonIndex + 1);
      }
      
      // Show toast
      setToast({
        show: true,
        message: `Navigating to: ${lesson.title}`
      });
      
      // Navigate to the lesson after a short delay
      setTimeout(() => {
        router.push(lesson.path);
      }, 1500);
    } else {
      // Show toast indicating previous lessons must be completed
      setToast({
        show: true,
        message: 'Complete previous lessons first!'
      });
    }
  };

  return (
    <div className="relative w-full max-w-3xl h-[700px]">
      {/* Path connector lines */}
      <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <path
          d="M320,60 C320,120 200,180 200,240 C200,300 440,360 440,420 C440,480 320,540 320,600 C320,660 320,720 320,780"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1, 8"
        />
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080" />
          <stop offset="50%" stopColor="#7928ca" />
          <stop offset="100%" stopColor="#4299e1" />
        </linearGradient>
      </svg>

      {/* Lesson nodes */}
      <div className="relative z-10">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            style={{
              position: 'absolute',
              left: `calc(50% + ${lesson.position.x}px)`,
              top: `${60 + lesson.position.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <LessonNode
              lesson={lesson}
              index={index}
              isActive={index <= userPosition}
              onClick={() => handleLessonClick(lesson)}
            />
          </div>
        ))}
      </div>

      {/* User avatar that moves along the path */}
      {userPosition > 0 && (
        <motion.div
          className="absolute z-20 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2"
          initial={{ left: `calc(50% + ${lessons[0].position.x}px)`, top: `${60 + lessons[0].position.y}px` }}
          animate={{ 
            left: `calc(50% + ${lessons[Math.min(userPosition, lessons.length - 1)].position.x}px)`, 
            top: `${60 + lessons[Math.min(userPosition, lessons.length - 1)].position.y}px` 
          }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#6366F1" />
            <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <Toast message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
      )}
    </div>
  );
} 