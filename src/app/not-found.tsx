'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => router.push('/'), 3000)

        return () => clearTimeout(timer);
    }, [router])

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, Page not found. You will be redirected to the home page.</p>
    </div>
  );
};

export default NotFound;

