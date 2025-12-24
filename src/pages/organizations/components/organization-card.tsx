import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Organization } from '../types';

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organization-dashboard/${organization.id}`);
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-primary/50',
        'relative overflow-hidden flex flex-col h-full bg-card'
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {organization.name}
          </h3>
          <Badge
            variant={organization.role === 'admin' ? 'default' : 'secondary'}
            className={cn(
              'capitalize shrink-0',
              organization.role === 'admin'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
            )}
          >
            {organization.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="font-medium">{organization.eventsCount}</span>
            <span className="text-xs">Events</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              {organization.registrationsCount.toLocaleString()}
            </span>
            <span className="text-xs">Regs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
