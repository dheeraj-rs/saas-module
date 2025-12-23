import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, Calendar, Users } from "lucide-react";
import type { Event } from "../types";

interface EventCardProps {
    event: Event;
    onClick?: () => void;
}

const statusConfig = {
    active: {
        variant: "default" as const,
        className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        label: "Active",
    },
    upcoming: {
        variant: "default" as const,
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        label: "Upcoming",
    },
    past: {
        variant: "secondary" as const,
        className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
        label: "Past",
    },
    cancelled: {
        variant: "destructive" as const,
        className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        label: "Cancelled",
    },
};

export function EventCard({ event, onClick }: EventCardProps) {
    const config = statusConfig[event.status];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateRange = () => {
        const start = formatDate(event.start_date);
        const end = formatDate(event.end_date);

        if (start === end) return start;
        return `${start} - ${end}`;
    };

    return (
        <Card
            className={cn(
                "group cursor-pointer transition-all duration-200",
                "hover:shadow-md hover:border-primary/50",
                "relative overflow-hidden flex flex-col h-full"
            )}
            onClick={onClick}
        >
            <div className="absolute top-3 right-3 z-10">
                <Badge variant={config.variant} className={cn("shrink-0", config.className)}>
                    {config.label}
                </Badge>
            </div>

            <CardHeader className="p-4 pb-2 flex-grow-0">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors pr-16 line-clamp-2">
                    {event.name}
                </h3>
            </CardHeader>

            <CardContent className="px-4 pb-4 pt-0 flex flex-col flex-1 justify-end space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
                    <Building2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate font-medium text-xs">{event.organization_name}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{formatDateRange()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span>
                            {event.registered} / {event.capacity}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
