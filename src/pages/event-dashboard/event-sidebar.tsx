'use client';

import { Button } from '@/components/ui/button';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarRail as ShadcnSidebarRail,
  useSidebar as useShadcnSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useRefineOptions } from '@refinedev/core';
import { ArrowLeft, LayoutDashboard, Users, Settings } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router';

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export function EventSidebar() {
  const { open } = useShadcnSidebar();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: `/event-dashboard/${eventId}`,
    },
    {
      key: 'registrations',
      label: 'Registrations',
      icon: <Users className="h-4 w-4" />,
      path: `/event-dashboard/${eventId}/registrations`,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      path: `/event-dashboard/${eventId}/settings`,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <ShadcnSidebar collapsible="icon" className={cn('border-none')}>
      <ShadcnSidebarRail />
      <SidebarHeader />
      <ShadcnSidebarContent
        className={cn(
          'transition-discrete',
          'duration-200',
          'flex',
          'flex-col',
          'gap-2',
          'pt-2',
          'pb-2',
          'border-r',
          'border-border',
          {
            'px-3': open,
            'px-1': !open,
          }
        )}
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="lg"
          className={cn('flex w-full items-center gap-2 py-2 text-sm mb-2', {
            'justify-center !px-2': !open,
            'justify-start !px-3': open,
          })}
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span
            className={cn('tracking-[-0.00875rem]', {
              'opacity-0': !open,
              hidden: !open,
            })}
          >
            Back to Events
          </span>
        </Button>

        {/* Divider */}
        <div className="border-t border-sidebar-border mb-2" />

        {/* Navigation Items */}
        {sidebarItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Button
              key={item.key}
              variant="ghost"
              size="lg"
              className={cn('flex w-full items-center gap-2 py-2 text-sm', {
                'bg-sidebar-primary': active,
                'hover:!bg-sidebar-primary/90': active,
                'text-sidebar-primary-foreground': active,
                'hover:text-sidebar-primary-foreground': active,
                'justify-center !px-2': !open,
                'justify-start !px-3': open,
              })}
              onClick={() => navigate(item.path)}
            >
              <div
                className={cn('w-4', {
                  'text-muted-foreground': !active,
                  'text-sidebar-primary-foreground': active,
                })}
              >
                {item.icon}
              </div>
              <span
                className={cn('tracking-[-0.00875rem]', {
                  'font-normal': !active,
                  'font-semibold': active,
                  'text-sidebar-primary-foreground': active,
                  'text-foreground': !active,
                  'opacity-0': !open,
                  hidden: !open,
                })}
              >
                {item.label}
              </span>
            </Button>
          );
        })}
      </ShadcnSidebarContent>
    </ShadcnSidebar>
  );
}

function SidebarHeader() {
  const { title } = useRefineOptions();
  const { open } = useShadcnSidebar();

  return (
    <ShadcnSidebarHeader
      className={cn(
        'p-0',
        'h-16',
        'border-b',
        'border-border',
        'flex-row',
        'items-center',
        'justify-between',
        'overflow-hidden'
      )}
    >
      <div
        className={cn(
          'whitespace-nowrap',
          'flex',
          'flex-row',
          'h-full',
          'items-center',
          'justify-start',
          'gap-2',
          'transition-discrete',
          'duration-200',
          {
            'pl-3': !open,
            'pl-5': open,
          }
        )}
      >
        {/* Logo - always visible */}
        <div className="shrink-0">{title.icon}</div>
        {/* Text - only visible when expanded */}
        <h2
          className={cn(
            'text-sm',
            'font-bold',
            'transition-opacity',
            'duration-200',
            {
              'opacity-0': !open,
              'opacity-100': open,
            }
          )}
        >
          {title.text}
        </h2>
      </div>
    </ShadcnSidebarHeader>
  );
}

EventSidebar.displayName = 'EventSidebar';
