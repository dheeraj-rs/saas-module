'use client';

import { useParams } from 'react-router';

export default function EventDashboard() {
  const { eventId } = useParams();

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="px-4 pt-4 pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Event Dashboard</h1>
          <p className="text-base text-muted-foreground">
            Dashboard for event: {eventId}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6">
        <div className="rounded-md border bg-card p-8">
          <p className="text-muted-foreground text-center">
            Event dashboard content will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
