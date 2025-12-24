'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import {
  Calendar,
  LayoutGrid,
  Search,
  Table as TableIcon,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { OrganizationCard } from './components/organization-card';
import { fakeOrganizations } from './fake-organizations-data';
import type { Organization, ViewMode } from './types';

const columnHelper = createColumnHelper<Organization>();

export default function AllOrganizations() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchValue, setSearchValue] = useState('');

  // Filter organizations
  const filteredOrgs = useMemo(() => {
    let result = [...fakeOrganizations];

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter((org) =>
        org.name.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [searchValue]);

  // Table Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Organization Name',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium shrink-0">
              {info
                .getValue()
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <span className="font-medium">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => {
          const role = info.getValue();
          const variant = role === 'admin' ? 'default' : 'secondary';
          const className =
            role === 'admin'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';

          return (
            <Badge
              variant={variant}
              className={cn(
                'capitalize font-normal border shadow-none',
                className
              )}
            >
              {role}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('eventsCount', {
        header: 'Events',
        cell: (info) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('registrationsCount', {
        header: 'Registrations',
        cell: (info) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{info.getValue().toLocaleString()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Joined Date',
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <div className="text-muted-foreground">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredOrgs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="px-4 pt-4 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              All Organizations
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Manage your organizations and memberships
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search organizations..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                className="pl-9 h-9 w-full bg-muted/50 border-input shadow-sm"
              />
            </div>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-background shrink-0">
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
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        {viewMode === 'grid' ? (
          filteredOrgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No organizations found
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredOrgs.map((org) => (
                  <OrganizationCard key={org.id} organization={org} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                {getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/30">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
                        <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No organizations found
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Try adjusting your search to find what you're looking
                          for.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/50 cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
