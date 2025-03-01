import ClientOnly from '../components/ClientOnly';
import LearningRoadmap from '../components/LearningRoadmap';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <h1 className="text-3xl font-bold mb-8">Python Learning Roadmap</h1>
      <ClientOnly>
        <LearningRoadmap />
      </ClientOnly>
    </main>
  );
} 