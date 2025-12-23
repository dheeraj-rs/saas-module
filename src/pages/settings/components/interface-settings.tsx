import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useThemeCustomization, type FontSize, type FontFamily } from "@/providers/theme-customization-provider";

export function InterfaceSettings() {
    const { fontSize, setFontSize, fontFamily, setFontFamily, borderRadius, setBorderRadius } =
        useThemeCustomization();

    const fontSizes: { value: FontSize; label: string; description: string }[] = [
        { value: "small", label: "Small", description: "Compact (14px)" },
        { value: "medium", label: "Medium", description: "Default (16px)" },
        { value: "large", label: "Large", description: "Comfortable (18px)" },
    ];

    const fontFamilies: { value: FontFamily; label: string }[] = [
        { value: "inter", label: "Inter" },
        { value: "roboto", label: "Roboto" },
        { value: "poppins", label: "Poppins" },
        { value: "open-sans", label: "Open Sans" },
        { value: "lato", label: "Lato" },
    ];

    return (
        <div className="space-y-6">
            {/* Font Size (UI Scale) */}
            <Card>
                <CardHeader>
                    <CardTitle>UI Scale</CardTitle>
                    <CardDescription>Adjust the overall size of the interface</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={fontSize} onValueChange={(value: FontSize) => setFontSize(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {fontSizes.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{size.label}</span>
                                        <span className="text-xs text-muted-foreground">{size.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Font Family */}
            <Card>
                <CardHeader>
                    <CardTitle>Font Family</CardTitle>
                    <CardDescription>Choose your preferred font</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={fontFamily} onValueChange={(value: FontFamily) => setFontFamily(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {fontFamilies.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Border Radius */}
            <Card>
                <CardHeader>
                    <CardTitle>Border Radius</CardTitle>
                    <CardDescription>
                        Adjust roundness of buttons, cards, and inputs ({borderRadius}px)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Slider
                        value={[borderRadius]}
                        onValueChange={(value) => setBorderRadius(value[0])}
                        min={0}
                        max={20}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sharp (0px)</span>
                        <span>Rounded (20px)</span>
                    </div>
                    {/* Preview */}
                    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm font-medium mb-3">Preview:</p>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium"
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                Button
                            </button>
                            <div
                                className="px-4 py-2 border bg-background text-sm"
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                Card
                            </div>
                            <input
                                type="text"
                                placeholder="Input"
                                className="px-3 py-2 border bg-background text-sm"
                                style={{ borderRadius: `${borderRadius}px` }}
                                readOnly
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
