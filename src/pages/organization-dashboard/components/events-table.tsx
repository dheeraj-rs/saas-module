'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Event } from '@/pages/events/types';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { formatDateRange } from '../utils/event-utils';

interface EventsTableProps {
  events: Event[];
}

type SortField = 'name' | 'start_date' | 'status' | 'registered' | 'capacity';
type SortDirection = 'asc' | 'desc';

const statusConfig = {
  active: {
    variant: 'default' as const,
    className:
      'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    label: 'Active',
  },
  upcoming: {
    variant: 'default' as const,
    className:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    label: 'Upcoming',
  },
  past: {
    variant: 'secondary' as const,
    className:
      'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    label: 'Past',
  },
  cancelled: {
    variant: 'destructive' as const,
    className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    label: 'Cancelled',
  },
};

export function EventsTable({ events }: EventsTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('start_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'start_date') {
      aValue = new Date(a.start_date).getTime();
      bValue = new Date(b.start_date).getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  if (events.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No events found</h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first event for this organization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="h-auto p-0 hover:bg-transparent font-semibold"
                >
                  Event Name
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('start_date')}
                  className="h-auto p-0 hover:bg-transparent font-semibold"
                >
                  Date
                  <SortIcon field="start_date" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 hover:bg-transparent font-semibold"
                >
                  Status
                  <SortIcon field="status" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('registered')}
                  className="h-auto p-0 hover:bg-transparent font-semibold"
                >
                  Registrations
                  <SortIcon field="registered" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('capacity')}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto"
                >
                  Capacity
                  <SortIcon field="capacity" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map((event) => {
              const config = statusConfig[event.status];
              return (
                <TableRow
                  key={event.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/event-dashboard/${event.id}`)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold group-hover:text-primary transition-colors">
                        {event.name}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateRange(event.start_date, event.end_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={config.variant}
                      className={cn(config.className)}
                    >
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[200px]">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">
                            {event.registered} / {event.capacity}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {event.fill_percentage}%
                        </span>
                      </div>
                      <Progress
                        value={event.fill_percentage}
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {event.capacity.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
