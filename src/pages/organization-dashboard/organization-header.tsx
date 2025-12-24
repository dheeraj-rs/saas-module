'use client';

import { UserAvatar } from '@/components/refine-ui/layout/user-avatar';
import { ThemeToggle } from '@/components/refine-ui/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  useActiveAuthProvider,
  useGetIdentity,
  useLogout,
  useRefineOptions,
} from '@refinedev/core';
import { LogOutIcon, Menu, SettingsIcon } from 'lucide-react';
import { OrganizationSwitcher } from './organization-switcher';

export function OrganizationHeader() {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
}

function DesktopHeader() {
  return (
    <header
      className={cn(
        'sticky',
        'top-0',
        'flex',
        'h-16',
        'shrink-0',
        'items-center',
        'gap-4',
        'border-b',
        'border-border',
        'bg-sidebar',
        'px-3',
        'justify-between',
        'z-40'
      )}
    >
      {/* Left side - Organization Switcher */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <OrganizationSwitcher />
      </div>

      {/* Right side - Theme Toggle and User Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
}

function MobileHeader() {
  const { toggleSidebar } = useSidebar();
  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        'sticky',
        'top-0',
        'flex',
        'h-12',
        'shrink-0',
        'items-center',
        'gap-2',
        'border-b',
        'border-border',
        'bg-sidebar',
        'px-2',
        'justify-between',
        'z-40'
      )}
    >
      {/* Left side - Sidebar trigger and logo */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="shrink-0">{title.icon}</div>
        </div>
      </div>

      {/* Center - Organization Switcher (compact) */}
      <div className="flex-1 min-w-0 flex justify-center">
        <OrganizationSwitcher />
      </div>

      {/* Right side - User Dropdown */}
      <div className="flex items-center gap-1 shrink-0">
        <UserDropdown />
      </div>
    </header>
  );
}

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: user } = useGetIdentity<{
    name?: string;
    email?: string;
    avatar?: string;
  }>();

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* User Info Section with Avatar */}
        {user && (
          <>
            <div className="flex items-center gap-3 px-2 py-2">
              <img
                src={
                  user.avatar ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                }
                alt={user.name || 'User'}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Settings Option */}
        <DropdownMenuItem asChild>
          <a href="/settings" className="cursor-pointer">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout Option */}
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn(
              'mr-2 h-4 w-4',
              'text-destructive',
              'hover:text-destructive'
            )}
          />
          <span className={cn('text-destructive', 'hover:text-destructive')}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

OrganizationHeader.displayName = 'OrganizationHeader';
DesktopHeader.displayName = 'DesktopHeader';
MobileHeader.displayName = 'MobileHeader';
