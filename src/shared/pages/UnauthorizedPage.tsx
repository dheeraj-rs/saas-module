/**
 * Unauthorized Page
 *
 * Shown when user tries to access a resource without permission
 */

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-warning">
            <ShieldAlert className="h-6 w-6" />
            <CardTitle>Access Denied</CardTitle>
          </div>
          <CardDescription>
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your organization
            administrator to request the necessary permissions.
          </p>
        </CardContent>

        <CardFooter>
          <Button onClick={() => navigate(-1)} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
