import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Columns3 } from 'lucide-react';

interface ColumnVisibilityToggleProps {
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  columns: Array<{ id: string; label: string }>;
}

export function ColumnVisibilityToggle({
  columnVisibility,
  onColumnVisibilityChange,
  columns,
}: ColumnVisibilityToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-muted/50 border-input shadow-sm"
        >
          <Columns3 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={columnVisibility[column.id] !== false}
            onCheckedChange={(checked) =>
              onColumnVisibilityChange(column.id, checked)
            }
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
