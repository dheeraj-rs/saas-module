import { useState } from "react";
import { AppearanceSettings } from "./components/appearance-settings";
import { GeneralSettings } from "./components/general-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeCustomization } from "@/providers/theme-customization-provider";
import { RotateCcw, Palette, Settings as SettingsIcon } from "lucide-react";

export const Settings = () => {
    const { resetToDefaults } = useThemeCustomization();
    const [activeTab, setActiveTab] = useState("appearance");

    return (
        <div className="flex flex-col h-full">
            {/* Header - No subtitle */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b">
                <h1 className="text-xl font-bold">Settings</h1>
                <Button variant="outline" size="sm" onClick={resetToDefaults} className="h-8 cursor-pointer">
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                {/* Tab List */}
                <div className="px-4 pt-2.5">
                    <TabsList className="inline-flex h-8 items-center justify-center rounded-lg bg-muted p-0.5">
                        <TabsTrigger
                            value="appearance"
                            className="inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer"
                        >
                            <Palette className="h-3.5 w-3.5 mr-1.5" />
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger
                            value="general"
                            className="inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer"
                        >
                            <SettingsIcon className="h-3.5 w-3.5 mr-1.5" />
                            General
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <TabsContent value="appearance" className="mt-0">
                        <AppearanceSettings />
                    </TabsContent>

                    <TabsContent value="general" className="mt-0">
                        <GeneralSettings />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
