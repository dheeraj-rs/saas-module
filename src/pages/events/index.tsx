'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Loader2,
  Search,
  Table as TableIcon,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { EventCard } from './components/event-card';
import { EventFiltersModal } from './components/event-filters-modal';
import { ColumnVisibilityToggle } from './components/column-visibility-toggle';
import { fakeEvents, fakeOrganizations } from './fake-events-data';
import type {
  Event,
  EventFilters as EventFiltersType,
  EventStatus,
  ViewMode,
} from './types';
import { useGetIdentity } from '@refinedev/core';
import type { User } from '@/config/api.config';
import { filterEventsByUser } from '@/lib/data-filter.utils';

const statusConfig = {
  active: {
    className:
      'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    label: 'Active',
    icon: '●',
  },
  upcoming: {
    className:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    label: 'Upcoming',
    icon: '◐',
  },
  past: {
    className:
      'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    label: 'Past',
    icon: '■',
  },
  cancelled: {
    className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    label: 'Cancelled',
    icon: '✕',
  },
};

const statusTabs: { value: EventStatus | 'all' | 'recent'; label: string }[] = [
  { value: 'recent', label: 'Recent' },
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const columnHelper = createColumnHelper<Event>();

export default function AllEvents() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTab, setActiveTab] = useState<EventStatus | 'all' | 'recent'>(
    'recent'
  );
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    name: true,
    organization: true,
    date: true,
    status: true,
    capacity: true,
    registered: true,
    fill_percentage: true,
  });

  const { data: user } = useGetIdentity<User>();
  const navigate = useNavigate();

  // Filter organizations based on user access
  const userOrganizations = useMemo(() => {
    if (!user || !user.organization_ids || user.organization_ids.length === 0) {
      return [];
    }
    return fakeOrganizations.filter((org) =>
      user.organization_ids.includes(org.id)
    );
  }, [user]);

  // Filter events based on user access first
  const userEvents = useMemo(() => {
    return filterEventsByUser(fakeEvents, user);
  }, [user]);

  // Filter events based on current filters and active tab
  const filteredEvents = useMemo(() => {
    let result = [...userEvents];

    // Apply tab filter
    if (activeTab !== 'all' && activeTab !== 'recent') {
      result = result.filter((event) => event.status === activeTab);
    } else if (activeTab === 'recent') {
      result = result
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 10);
    }

    // Apply organization filter
    if (filters.organization && filters.organization.length > 0) {
      result = result.filter((event) =>
        filters.organization?.includes(event.organization_id)
      );
    }

    // Apply search filter
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(searchLower) ||
          event.organization_name.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [userEvents, activeTab, filters, searchValue]);

  // Pagination
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredEvents.slice(start, end);
  }, [filteredEvents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEvents.length / pageSize);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalCapacity = filteredEvents.reduce(
      (sum, event) => sum + event.capacity,
      0
    );
    const totalRegistered = filteredEvents.reduce(
      (sum, event) => sum + event.registered,
      0
    );
    const avgFill =
      totalCapacity > 0
        ? ((totalRegistered / totalCapacity) * 100).toFixed(1)
        : '0.0';

    return {
      totalEvents: filteredEvents.length,
      totalCapacity,
      avgFill,
    };
  }, [filteredEvents]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Event Name',
        cell: (info) => <div className="font-medium">{info.getValue()}</div>,
      }),
      columnHelper.accessor('organization_name', {
        id: 'organization',
        header: 'Organization',
        cell: (info) => (
          <div className="text-muted-foreground">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('start_date', {
        id: 'date',
        header: 'Date',
        cell: (info) => {
          const event = info.row.original;
          const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          };

          const start = formatDate(event.start_date);
          const end = formatDate(event.end_date);

          return (
            <div className="text-muted-foreground whitespace-nowrap">
              {start} - {end}
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const config = statusConfig[status];
          return (
            <Badge
              variant="outline"
              className={cn('gap-1.5', config.className)}
            >
              <span className="text-xs">{config.icon}</span>
              {config.label}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('capacity', {
        id: 'capacity',
        header: 'Capacity',
        cell: (info) => (
          <div className="text-muted-foreground">
            {info.getValue().toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor('registered', {
        id: 'registered',
        header: 'Registered',
        cell: (info) => (
          <div className="text-muted-foreground">
            {info.getValue().toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor('fill_percentage', {
        id: 'fill_percentage',
        header: 'Fill %',
        cell: (info) => {
          const percentage = info.getValue();
          return (
            <div>
              <span
                className={cn(
                  'font-medium',
                  percentage >= 90 && 'text-red-600 dark:text-red-400',
                  percentage >= 70 &&
                    percentage < 90 &&
                    'text-orange-600 dark:text-orange-400',
                  percentage >= 50 &&
                    percentage < 70 &&
                    'text-blue-600 dark:text-blue-400',
                  percentage < 50 && 'text-muted-foreground'
                )}
              >
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        },
      }),
    ],
    []
  );

  // Filter columns based on visibility
  const visibleColumns = useMemo(() => {
    return columns.filter((column) => {
      const columnId = column.id as string;
      return columnVisibility[columnId] !== false;
    });
  }, [columns, columnVisibility]);

  const table = useReactTable({
    data: paginatedEvents,
    columns: visibleColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  const isLoading = false; // No async loading for local data

  const handleOrganizationChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === 'all') {
      delete newFilters.organization;
    } else {
      newFilters.organization = [value];
    }
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearActiveTabFilter = () => {
    setActiveTab('all');
    setCurrentPage(1);
  };

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const activeFiltersList: { label: string; onRemove: () => void }[] = [];

    if (activeTab !== 'all') {
      const tabLabel =
        statusTabs.find((t) => t.value === activeTab)?.label || activeTab;
      activeFiltersList.push({
        label: tabLabel,
        onRemove: clearActiveTabFilter,
      });
    }

    if (filters.organization && filters.organization.length > 0) {
      const orgName = fakeOrganizations.find(
        (o) => o.id === filters.organization![0]
      )?.name;
      if (orgName) {
        activeFiltersList.push({
          label: `Organization: ${orgName}`,
          onRemove: () => {
            setFilters({ ...filters, organization: undefined });
            setCurrentPage(1);
          },
        });
      }
    }

    if (filters.createdFrom) {
      activeFiltersList.push({
        label: `From: ${new Date(filters.createdFrom).toLocaleDateString()}`,
        onRemove: () => {
          setFilters({ ...filters, createdFrom: undefined });
          setCurrentPage(1);
        },
      });
    }

    if (filters.createdUntil) {
      activeFiltersList.push({
        label: `Until: ${new Date(filters.createdUntil).toLocaleDateString()}`,
        onRemove: () => {
          setFilters({ ...filters, createdUntil: undefined });
          setCurrentPage(1);
        },
      });
    }

    if (searchValue.trim()) {
      activeFiltersList.push({
        label: `Search: "${searchValue}"`,
        onRemove: () => {
          setSearchValue('');
          setCurrentPage(1);
        },
      });
    }

    return activeFiltersList;
  }, [
    activeTab,
    searchValue,
    filters.organization,
    filters.createdFrom,
    filters.createdUntil,
  ]);

  // Filters Component (reusable)
  const FiltersRow = () => (
    <div className="space-y-3">
      {/* Main Filters Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Group by
          </span>
          <Select
            value={filters.organization?.[0] || 'all'}
            onValueChange={handleOrganizationChange}
          >
            <SelectTrigger className="h-9 w-full sm:w-[280px] bg-muted/50 border-input shadow-sm">
              <span className="truncate">
                {filters.organization?.[0] && filters.organization[0] !== 'all'
                  ? fakeOrganizations.find(
                      (o) => o.id === filters.organization![0]
                    )?.name
                  : '-'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">-</SelectItem>
              {userOrganizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 w-full bg-muted/50 border-input shadow-sm"
            />
          </div>

          <EventFiltersModal
            onApplyFilters={(dateFilters) => {
              setFilters({
                ...filters,
                createdFrom: dateFilters.createdFrom,
                createdUntil: dateFilters.createdUntil,
              });
              setCurrentPage(1);
            }}
          />

          <ColumnVisibilityToggle
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={(columnId, visible) => {
              setColumnVisibility((prev) => ({
                ...prev,
                [columnId]: visible,
              }));
            }}
            columns={[
              { id: 'name', label: 'Event Name' },
              { id: 'organization', label: 'Organization' },
              { id: 'date', label: 'Date' },
              { id: 'status', label: 'Status' },
              { id: 'capacity', label: 'Capacity' },
              { id: 'registered', label: 'Registered' },
              { id: 'fill_percentage', label: 'Fill %' },
            ]}
          />
        </div>
      </div>

      {/* Active Filters Row - Only badges have blue background */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">
            Active filters
          </span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="outline"
              className="gap-1.5 pr-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                className="ml-1 hover:bg-blue-500/20 rounded-sm p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            onClick={() => {
              setActiveTab('all');
              setFilters({});
              setSearchValue('');
              setCurrentPage(1);
            }}
            className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Events</h1>
            <p className="text-base text-muted-foreground mt-1">
              Browse and manage events across all your organizations
            </p>
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3 gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3 gap-2"
            >
              <TableIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Status Tabs - Centered & Wrapping */}
      <div className="flex justify-center px-4 pb-4">
        <div className="flex flex-wrap justify-center items-center gap-2 p-2 bg-background border rounded-lg shadow-sm">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
              }}
              className={cn(
                'h-8 px-4 rounded-md',
                activeTab === tab.value ? 'shadow-sm' : 'hover:bg-muted'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Filters Row - Only for Grid View */}
      {viewMode === 'grid' && (
        <div className="px-4 pb-4">
          <FiltersRow />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : viewMode === 'grid' ? (
          filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            /* Grid View - Filters, Summary, and Pagination are outside */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination for Grid */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm pt-4 border-t">
                <div className="text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, filteredEvents.length)} of{' '}
                  {filteredEvents.length} results
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Per page</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={currentPage === 1 ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </Button>
                    {totalPages > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          /* Table View - Everything inside one bordered container */
          <div className="rounded-md border bg-card overflow-hidden">
            {/* Filters inside table */}
            <div className="p-4 border-b bg-muted/30">
              <div className="space-y-3">
                {/* Main Filters Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Group by
                    </span>
                    <Select
                      value={filters.organization?.[0] || 'all'}
                      onValueChange={handleOrganizationChange}
                    >
                      <SelectTrigger className="h-9 w-full sm:w-[280px] bg-muted/50 border-input shadow-sm">
                        <span className="truncate">
                          {filters.organization?.[0] &&
                          filters.organization[0] !== 'all'
                            ? fakeOrganizations.find(
                                (o) => o.id === filters.organization![0]
                              )?.name
                            : '-'}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-</SelectItem>
                        {userOrganizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search"
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-9 h-9 w-full bg-muted/50 border-input shadow-sm"
                      />
                    </div>

                    <EventFiltersModal
                      onApplyFilters={(dateFilters) => {
                        setFilters({
                          ...filters,
                          createdFrom: dateFilters.createdFrom,
                          createdUntil: dateFilters.createdUntil,
                        });
                        setCurrentPage(1);
                      }}
                    />

                    <ColumnVisibilityToggle
                      columnVisibility={columnVisibility}
                      onColumnVisibilityChange={(columnId, visible) => {
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [columnId]: visible,
                        }));
                      }}
                      columns={[
                        { id: 'name', label: 'Event Name' },
                        { id: 'organization', label: 'Organization' },
                        { id: 'date', label: 'Date' },
                        { id: 'status', label: 'Status' },
                        { id: 'capacity', label: 'Capacity' },
                        { id: 'registered', label: 'Registered' },
                        { id: 'fill_percentage', label: 'Fill %' },
                      ]}
                    />
                  </div>
                </div>

                {/* Active Filters Row */}
                {activeFilters.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground">
                      Active filters
                    </span>
                    {activeFilters.map((filter, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="gap-1.5 pr-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                      >
                        {filter.label}
                        <button
                          onClick={filter.onRemove}
                          className="ml-1 hover:bg-blue-500/20 rounded-sm p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <button
                      onClick={() => {
                        setActiveTab('all');
                        setFilters({});
                        setSearchValue('');
                        setCurrentPage(1);
                      }}
                      className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                {getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/50 border-b"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-sm"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'flex items-center gap-1.5 cursor-pointer select-none group hover:text-foreground transition-colors'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span>
                              {typeof header.column.columnDef.header ===
                              'function'
                                ? header.column.columnDef.header(
                                    header.getContext()
                                  )
                                : header.column.columnDef.header}
                            </span>
                            {header.column.getCanSort() && (
                              <div className="flex-shrink-0">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUp className="h-3.5 w-3.5 text-primary" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ArrowDown className="h-3.5 w-3.5 text-primary" />
                                ) : (
                                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 text-center"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No events found
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Try adjusting your filters to see more results.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() =>
                        navigate(`/event-dashboard/${row.original.id}`)
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {typeof cell.column.columnDef.cell === 'function'
                            ? cell.column.columnDef.cell(cell.getContext())
                            : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Summary Section - Inside table container */}
            <div className="bg-muted/30 p-4 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-medium">Summary</div>
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 sm:gap-8 text-sm">
                  <div className="text-left">
                    <div className="text-muted-foreground">Total Events</div>
                    <div className="font-semibold">
                      {summaryStats.totalEvents}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-muted-foreground">Total Capacity</div>
                    <div className="font-semibold">
                      {summaryStats.totalCapacity.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-muted-foreground">Avg Fill</div>
                    <div className="font-semibold">{summaryStats.avgFill}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination - Inside table container */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm p-4 border-t bg-background">
              <div className="text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredEvents.length)} of{' '}
                {filteredEvents.length} results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Per page</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={currentPage === 1 ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                  {totalPages > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
