import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Grid3x3, Table } from "lucide-react";
import type { ViewMode } from "../types";

interface ViewToggleProps {
    view: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("grid")}
                className={cn(
                    "h-8 px-3 gap-2",
                    view === "grid" && "shadow-sm"
                )}
            >
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("table")}
                className={cn(
                    "h-8 px-3 gap-2",
                    view === "table" && "shadow-sm"
                )}
            >
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
            </Button>
        </div>
    );
}
