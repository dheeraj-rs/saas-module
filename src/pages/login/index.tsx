import { SignInForm } from '@/components/refine-ui/form/sign-in-form';

export const Login = () => {
  return (
    <div className="relative w-full h-full">
      <SignInForm />
      {/* Test Credentials Hint */}
      <div className="fixed bottom-4 right-4 bg-muted/80 backdrop-blur-sm border border-border rounded-lg p-4 text-xs max-w-sm shadow-lg">
        <p className="font-semibold mb-2 text-foreground">
          🧪 Test Credentials
        </p>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          <div>
            <p className="text-muted-foreground font-medium">
              john.williams@organizer.com
            </p>
            <p className="text-muted-foreground">
              password123 • Org Admin (2 orgs)
            </p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground font-medium">
              sarah.johnson@organizer.com
            </p>
            <p className="text-muted-foreground">
              password123 • Event Manager (2 orgs, 2 events)
            </p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground font-medium">
              michael.chen@organizer.com
            </p>
            <p className="text-muted-foreground">
              password123 • Super Admin (5 orgs)
            </p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground font-medium">
              emily.rodriguez@organizer.com
            </p>
            <p className="text-muted-foreground">
              password123 • Event Manager (2 orgs, 3 events)
            </p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground font-medium">
              david.kim@organizer.com
            </p>
            <p className="text-muted-foreground">
              password123 • Org Admin (1 org)
            </p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground font-medium">
              lisa.thompson@organizer.com
            </p>
            <p className="text-muted-foreground">
              password123 • User (3 orgs, 1 event)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
