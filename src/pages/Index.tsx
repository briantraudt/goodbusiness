
import React, { Suspense } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical components
const Pillars = React.lazy(() => import('@/components/home/Pillars'));
const Focus = React.lazy(() => import('@/components/home/Focus'));
const CTA = React.lazy(() => import('@/components/home/CTA'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="container-custom py-12">
    <Skeleton className="w-full h-32 rounded-lg mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="w-full h-64 rounded-lg" />
      <Skeleton className="w-full h-64 rounded-lg" />
      <Skeleton className="w-full h-64 rounded-lg" />
    </div>
  </div>
);

const Index = () => {
  return (
    <PageLayout>
      <Hero />
      <Intro />
      <Suspense fallback={<LoadingFallback />}>
        <Pillars />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Focus />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <CTA />
      </Suspense>
    </PageLayout>
  );
};

export default Index;
