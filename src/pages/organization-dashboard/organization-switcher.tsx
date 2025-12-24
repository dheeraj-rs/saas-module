'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';
import { filterOrganizationsByUser } from '@/lib/data-filter.utils';
import { cn } from '@/lib/utils';
import { fakeOrganizations } from '@/pages/organizations/fake-organizations-data';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

export function OrganizationSwitcher() {
  const { user, loading } = useUser();
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  // Filter organizations based on user access
  const userOrganizations = filterOrganizationsByUser(fakeOrganizations, user);

  // Find current organization
  const currentOrganization = userOrganizations.find((org) => org.id === orgId);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        <Building2 className="h-4 w-4 text-muted-foreground animate-pulse" />
        {!isMobile && (
          <span className="text-sm text-muted-foreground">Loading...</span>
        )}
      </div>
    );
  }

  if (!currentOrganization || userOrganizations.length === 0) {
    return null;
  }

  const handleOrganizationSwitch = (organizationId: string) => {
    if (organizationId !== orgId) {
      navigate(`/organization-dashboard/${organizationId}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex',
            'items-center',
            'gap-2',
            'h-auto',
            'hover:bg-accent/50',
            'transition-all',
            'duration-200',
            'group',
            'min-w-0',
            {
              'px-2 py-1.5 max-w-[220px]': isMobile,
              'px-3 py-2 max-w-[350px]': !isMobile,
            }
          )}
        >
          <div
            className={cn(
              'flex',
              'items-center',
              'justify-center',
              'rounded-md',
              'bg-gradient-to-br',
              'from-primary/10',
              'to-primary/5',
              'group-hover:from-primary/20',
              'group-hover:to-primary/10',
              'transition-all',
              'duration-200',
              'shrink-0',
              {
                'h-7 w-7': isMobile,
                'h-8 w-8': !isMobile,
              }
            )}
          >
            <Building2
              className={cn('text-primary', {
                'h-3.5 w-3.5': isMobile,
                'h-4 w-4': !isMobile,
              })}
            />
          </div>
          {!isMobile && (
            <div className="flex flex-col items-start justify-center min-w-0 flex-1">
              <span className="text-sm font-medium w-full text-left truncate">
                {currentOrganization.name}
              </span>
              <span className="text-xs text-muted-foreground">
                Organization
              </span>
            </div>
          )}
          <ChevronDown
            className={cn(
              'text-muted-foreground',
              'transition-transform',
              'duration-200',
              'group-data-[state=open]:rotate-180',
              'shrink-0',
              {
                'h-3.5 w-3.5': isMobile,
                'h-4 w-4': !isMobile,
              }
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn({
          'min-w-[240px] max-w-[320px] w-auto': isMobile,
          'min-w-[280px] max-w-[400px] w-auto': !isMobile,
        })}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Switch Organization</span>
          <span className="text-xs font-normal text-muted-foreground">
            {userOrganizations.length}{' '}
            {userOrganizations.length === 1 ? 'org' : 'orgs'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {userOrganizations.map((org) => {
            const isActive = org.id === orgId;
            return (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleOrganizationSwitch(org.id)}
                className={cn(
                  'flex',
                  'items-start',
                  'gap-3',
                  'px-3',
                  'py-3',
                  'cursor-pointer',
                  'transition-all',
                  'duration-200',
                  {
                    'bg-accent': isActive,
                    'hover:bg-accent/50': !isActive,
                  }
                )}
              >
                <div
                  className={cn(
                    'flex',
                    'items-center',
                    'justify-center',
                    'h-9',
                    'w-9',
                    'rounded-md',
                    'bg-gradient-to-br',
                    'transition-all',
                    'duration-200',
                    'shrink-0',
                    {
                      'from-primary/20 to-primary/10': isActive,
                      'from-muted to-muted/50': !isActive,
                    }
                  )}
                >
                  <Building2
                    className={cn('h-4 w-4', {
                      'text-primary': isActive,
                      'text-muted-foreground': !isActive,
                    })}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                  <span
                    className={cn('text-sm font-medium leading-tight', {
                      'text-foreground': isActive,
                      'text-foreground/90': !isActive,
                    })}
                  >
                    {org.name}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {org.eventsCount}{' '}
                    {org.eventsCount === 1 ? 'event' : 'events'} • {org.role}
                  </span>
                </div>
                {isActive && (
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

OrganizationSwitcher.displayName = 'OrganizationSwitcher';
