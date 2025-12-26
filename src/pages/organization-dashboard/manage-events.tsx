'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/contexts/UserContext';
import { fakeEvents } from '@/pages/events/fake-events-data';
import { fakeOrganizations } from '@/pages/events/fake-events-data';
import type { EventStatus } from '@/pages/events/types';
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  Plus,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { CreateEventDialog } from './components/create-event-dialog';
import { EventsTable } from './components/events-table';
import {
  calculateEventStats,
  filterEventsByOrganization,
} from './utils/event-utils';

export default function ManageEvents() {
  const { orgId } = useParams();
  const { loading } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Find the organization name from fake data
  const organization = fakeOrganizations.find((org) => org.id === orgId);
  const organizationName = organization?.name || 'Unknown Organization';

  // Filter events by organization
  const organizationEvents = useMemo(() => {
    if (!orgId) return [];
    return filterEventsByOrganization(fakeEvents, orgId);
  }, [orgId]);

  // Apply search and status filters
  const filteredEvents = useMemo(() => {
    let filtered = organizationEvents;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [organizationEvents, statusFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(
    () => calculateEventStats(organizationEvents),
    [organizationEvents]
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-base text-muted-foreground">
            Manage events for{' '}
            <span className="font-semibold text-foreground">
              {organizationName}
            </span>
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="gap-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Create Event
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Events */}
        <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All events for this organization
            </p>
          </CardContent>
        </Card>

        {/* Active Events */}
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently running events
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.upcoming}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled for the future
            </p>
          </CardContent>
        </Card>

        {/* Total Registrations */}
        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalRegistrations.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3" />
              {stats.averageFillRate}% average fill rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as EventStatus | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 px-2 py-0">
                    Active
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="upcoming">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 px-2 py-0">
                    Upcoming
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="past">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 px-2 py-0">
                    Past
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="cancelled">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 px-2 py-0">
                    Cancelled
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="gap-2"
            >
              <CalendarX2 className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {filteredEvents.length !== organizationEvents.length && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing{' '}
            <span className="font-semibold text-foreground">
              {filteredEvents.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">
              {organizationEvents.length}
            </span>{' '}
            events
          </span>
        </div>
      )}

      {/* Events Table */}
      <EventsTable events={filteredEvents} />

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        organizationId={orgId || ''}
        organizationName={organizationName}
        onEventCreated={() => {
          // In a real app, you would refetch the events here
          console.log('Event created, refreshing list...');
        }}
      />
    </div>
  );
}
