'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-mono mb-4">404</h1>
        <p className="text-lg">Page not found</p>
        <p className="text-sm text-gray-400 mt-2">Redirecting to dashboard...</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-blue-400 hover:text-blue-300 mt-4 inline-block underline"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
}
