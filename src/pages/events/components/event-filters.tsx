import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Filter, Search, X } from "lucide-react";
import { useState } from "react";
import type { EventFilters, EventStatus } from "../types";
import type { Organization } from "../types";

interface EventFiltersProps {
    filters: EventFilters;
    organizations: Organization[];
    onFiltersChange: (filters: EventFilters) => void;
    className?: string;
}

const statusOptions: { value: EventStatus | "all"; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
    { value: "cancelled", label: "Cancelled" },
];

export function EventFilters({
    filters,
    organizations,
    onFiltersChange,
    className,
}: EventFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || "");

    const handleStatusChange = (value: string) => {
        const newFilters = { ...filters };
        if (value === "all") {
            delete newFilters.status;
        } else {
            newFilters.status = [value as EventStatus];
        }
        onFiltersChange(newFilters);
    };

    const handleOrganizationChange = (value: string) => {
        const newFilters = { ...filters };
        if (value === "all") {
            delete newFilters.organization;
        } else {
            newFilters.organization = [value];
        }
        onFiltersChange(newFilters);
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        const newFilters = { ...filters };
        if (value.trim()) {
            newFilters.search = value.trim();
        } else {
            delete newFilters.search;
        }
        onFiltersChange(newFilters);
    };

    const handleClearFilters = () => {
        setSearchValue("");
        onFiltersChange({});
    };

    const hasActiveFilters = filters.status || filters.organization || filters.search;

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters:</span>
                </div>

                {/* Status Filter */}
                <Select
                    value={filters.status?.[0] || "all"}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Organization Filter */}
                <Select
                    value={filters.organization?.[0] || "all"}
                    onValueChange={handleOrganizationChange}
                >
                    <SelectTrigger className="w-[180px] sm:w-[220px] h-9">
                        <SelectValue placeholder="Organization" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Organizations</SelectItem>
                        {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                                {org.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-9 gap-1.5"
                    >
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
