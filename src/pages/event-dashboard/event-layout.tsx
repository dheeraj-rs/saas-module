'use client';

import { Header } from '@/components/refine-ui/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';
import { EventSidebar } from './event-sidebar';

export function EventLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <EventSidebar />
      <SidebarInset>
        <Header />
        <main
          className={cn(
            '@container/main',
            'container',
            'mx-auto',
            'relative',
            'w-full',
            'flex',
            'flex-col',
            'flex-1',
            'px-2',
            'pt-4',
            'md:p-4',
            'lg:px-6',
            'lg:pt-6'
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

EventLayout.displayName = 'EventLayout';
