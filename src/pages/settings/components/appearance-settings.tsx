import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/components/refine-ui/theme/theme-provider";
import { useThemeCustomization, type ColorScheme, type FontSize, type FontFamily } from "@/providers/theme-customization-provider";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme();
    const { colorScheme, setColorScheme, fontSize, setFontSize, fontFamily, setFontFamily, borderRadius, setBorderRadius } =
        useThemeCustomization();

    const colorSchemes: { value: ColorScheme; label: string; colors: { primary: string; bg: string } }[] = [
        { value: "blue-white", label: "Blue", colors: { primary: "hsl(210, 100%, 50%)", bg: "hsl(0, 0%, 100%)" } },
        { value: "red-white", label: "Red", colors: { primary: "hsl(355, 78%, 56%)", bg: "hsl(0, 0%, 100%)" } },
        { value: "black-white", label: "Black", colors: { primary: "hsl(0, 0%, 9%)", bg: "hsl(0, 0%, 100%)" } },
    ];

    const fontSizes: { value: FontSize; label: string }[] = [
        { value: "tiny", label: "Tiny" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "extra-large", label: "Extra Large" },
    ];

    const fontFamilies: { value: FontFamily; label: string }[] = [
        { value: "inter", label: "Inter" },
        { value: "sans-serif", label: "Sans-serif" },
        { value: "roboto", label: "Roboto" },
        { value: "poppins", label: "Poppins" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {/* Left Column */}
            <div className="space-y-2.5">
                {/* Theme Mode */}
                <div className="rounded-lg bg-muted/40 p-3">
                    <h3 className="text-sm font-semibold mb-2.5">Theme Mode</h3>
                    <RadioGroup
                        value={theme}
                        onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                        className="flex gap-2"
                    >
                        <Label htmlFor="light" className="flex items-center space-x-1.5 flex-1 cursor-pointer">
                            <RadioGroupItem value="light" id="light" className="h-4 w-4" />
                            <span className="text-sm">Light</span>
                        </Label>
                        <Label htmlFor="dark" className="flex items-center space-x-1.5 flex-1 cursor-pointer">
                            <RadioGroupItem value="dark" id="dark" className="h-4 w-4" />
                            <span className="text-sm">Dark</span>
                        </Label>
                        <Label htmlFor="system" className="flex items-center space-x-1.5 flex-1 cursor-pointer">
                            <RadioGroupItem value="system" id="system" className="h-4 w-4" />
                            <span className="text-sm">System</span>
                        </Label>
                    </RadioGroup>
                </div>

                {/* UI Scale */}
                <div className="rounded-lg bg-muted/40 p-3">
                    <h3 className="text-sm font-semibold mb-2.5">UI Scale</h3>
                    <Select value={fontSize} onValueChange={(value: FontSize) => setFontSize(value)}>
                        <SelectTrigger className="h-9 text-sm cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {fontSizes.map((size) => (
                                <SelectItem key={size.value} value={size.value} className="text-sm cursor-pointer">
                                    {size.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Font Family */}
                <div className="rounded-lg bg-muted/40 p-3">
                    <h3 className="text-sm font-semibold mb-2.5">Font Family</h3>
                    <Select value={fontFamily} onValueChange={(value: FontFamily) => setFontFamily(value)}>
                        <SelectTrigger className="h-9 text-sm cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {fontFamilies.map((font) => (
                                <SelectItem key={font.value} value={font.value} className="text-sm cursor-pointer">
                                    {font.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Border Radius */}
                <div className="rounded-lg bg-muted/40 p-3">
                    <h3 className="text-sm font-semibold mb-2.5">Border Radius ({borderRadius}px)</h3>
                    <Slider
                        value={[borderRadius]}
                        onValueChange={(value) => setBorderRadius(value[0])}
                        min={0}
                        max={20}
                        step={1}
                        className="mb-2.5 cursor-pointer"
                    />
                    <div className="flex gap-1.5">
                        <div className="h-7 w-7 bg-primary" style={{ borderRadius: `${borderRadius}px` }} />
                        <div className="h-7 w-7 border" style={{ borderRadius: `${borderRadius}px` }} />
                        <input
                            type="text"
                            placeholder="Input"
                            className="flex-1 h-7 px-2 border bg-background text-xs"
                            style={{ borderRadius: `${borderRadius}px` }}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {/* Right Column - Color Theme */}
            <div className="rounded-lg bg-muted/40 p-3">
                <h3 className="text-sm font-semibold mb-2.5">Color Theme</h3>
                <div className="grid grid-cols-1 gap-2">
                    {colorSchemes.map((scheme) => (
                        <button
                            key={scheme.value}
                            onClick={() => setColorScheme(scheme.value)}
                            className={cn(
                                "relative rounded-md border p-2.5 transition-all hover:border-primary/50 cursor-pointer",
                                colorScheme === scheme.value ? "border-primary bg-primary/5" : "border-border"
                            )}
                        >
                            {colorScheme === scheme.value && (
                                <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                </div>
                            )}
                            <div className="flex items-center gap-2.5">
                                <div className="flex gap-1.5">
                                    <div
                                        className="h-8 w-8 rounded border shadow-sm"
                                        style={{ backgroundColor: scheme.colors.primary }}
                                    />
                                    <div
                                        className="h-8 w-8 rounded border shadow-sm"
                                        style={{ backgroundColor: scheme.colors.bg }}
                                    />
                                </div>
                                <p className="text-sm font-medium">{scheme.label}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
