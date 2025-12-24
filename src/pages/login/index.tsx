import { SignInForm } from '@/components/refine-ui/form/sign-in-form';

export const Login = () => {
  return (
    <div className="relative w-full h-full">
      <SignInForm />
      {/* Test Credentials Hint */}
      <div className="fixed bottom-4 right-4 bg-muted/80 backdrop-blur-sm border border-border rounded-lg p-4 text-xs max-w-xs shadow-lg">
        <p className="font-semibold mb-2 text-foreground">
          🧪 Test Credentials
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-muted-foreground">john.williams@organizer.com</p>
            <p className="text-muted-foreground">password123</p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-muted-foreground">sarah.johnson@organizer.com</p>
            <p className="text-muted-foreground">password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
