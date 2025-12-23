import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GeneralSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">General Preferences</CardTitle>
                <CardDescription className="text-xs">
                    General application preferences (Coming soon)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Additional settings will be available here in future updates.
                </p>
            </CardContent>
        </Card>
    );
}
