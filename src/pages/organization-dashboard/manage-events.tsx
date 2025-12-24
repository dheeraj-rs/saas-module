'use client';

import { useParams } from 'react-router';

export default function ManageEvents() {
  const { orgId } = useParams();

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="px-4 pt-4 pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-base text-muted-foreground">
            Manage events for organization: {orgId}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6">
        <div className="rounded-md border bg-card p-8">
          <p className="text-muted-foreground text-center">
            Event management content will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
