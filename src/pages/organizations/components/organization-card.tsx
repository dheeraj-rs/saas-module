import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Organization } from "../types";

interface OrganizationCardProps {
    organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <Card className={cn(
            "group cursor-pointer transition-all duration-200",
            "hover:shadow-md hover:border-primary/50",
            "relative overflow-hidden flex flex-col h-full bg-card"
        )}>
            <CardHeader className="p-2 flex-row items-center gap-2 space-y-0 relative">
                <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center text-xs font-semibold shrink-0">
                    {getInitials(organization.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors truncate">
                        {organization.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className={cn("capitalize px-1.5 py-0 rounded-sm bg-secondary text-secondary-foreground font-medium",
                            organization.role === 'admin' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : ""
                        )}>
                            {organization.role}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            {organization.eventsCount} Events
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            {organization.registrationsCount} Regs
                        </span>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
