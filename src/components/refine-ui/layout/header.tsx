import { UserAvatar } from '@/components/refine-ui/layout/user-avatar';
import { ThemeToggle } from '@/components/refine-ui/theme/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  useActiveAuthProvider,
  useGetIdentity,
  useLogout,
  useRefineOptions,
} from '@refinedev/core';
import { LogOutIcon, SettingsIcon } from 'lucide-react';

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

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
        'pr-3',
        'justify-end',
        'z-40'
      )}
    >
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

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
        'pr-3',
        'justify-between',
        'z-40'
      )}
    >
      <SidebarTrigger
        className={cn(
          'text-muted-foreground',
          'rotate-180',
          'ml-1',
          'cursor-pointer',
          {
            'opacity-0': open,
            'opacity-100': !open || isMobile,
            'pointer-events-auto': !open || isMobile,
            'pointer-events-none': open && !isMobile,
          }
        )}
      />

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
        <div>{title.icon}</div>
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

      <UserDropdown />
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

Header.displayName = 'Header';
MobileHeader.displayName = 'MobileHeader';
DesktopHeader.displayName = 'DesktopHeader';
