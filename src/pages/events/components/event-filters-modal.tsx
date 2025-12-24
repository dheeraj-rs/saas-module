import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover as DatePopover,
  PopoverContent as DatePopoverContent,
  PopoverTrigger as DatePopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Filter } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventFiltersModalProps {
  onApplyFilters: (filters: {
    createdFrom?: Date;
    createdUntil?: Date;
  }) => void;
}

export function EventFiltersModal({ onApplyFilters }: EventFiltersModalProps) {
  const [open, setOpen] = useState(false);
  const [createdFrom, setCreatedFrom] = useState<Date>();
  const [createdUntil, setCreatedUntil] = useState<Date>();

  const handleReset = () => {
    setCreatedFrom(undefined);
    setCreatedUntil(undefined);
  };

  const handleApply = () => {
    onApplyFilters({
      createdFrom,
      createdUntil,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 px-3 bg-muted/50 border-input shadow-sm"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-auto p-0 text-sm font-normal hover:bg-transparent hover:underline"
            >
              Reset
            </Button>
          </div>

          {/* Created From */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Created from</label>
            <DatePopover>
              <DatePopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !createdFrom && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {createdFrom ? (
                    format(createdFrom, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </DatePopoverTrigger>
              <DatePopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={createdFrom}
                  onSelect={setCreatedFrom}
                  initialFocus
                />
              </DatePopoverContent>
            </DatePopover>
          </div>

          {/* Created Until */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Created until</label>
            <DatePopover>
              <DatePopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !createdUntil && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {createdUntil ? (
                    format(createdUntil, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </DatePopoverTrigger>
              <DatePopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={createdUntil}
                  onSelect={setCreatedUntil}
                  initialFocus
                />
              </DatePopoverContent>
            </DatePopover>
          </div>

          {/* Apply Button */}
          <Button onClick={handleApply} className="w-full">
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
