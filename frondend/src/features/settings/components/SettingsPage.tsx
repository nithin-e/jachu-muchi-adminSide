import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import PageHeader from "@shared/components/PageHeader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Switch } from "@shared/components/ui/switch";
import type { Settings } from "../types";
import { saveSettings } from "../api/settingsApi";
import type { SaveSettingsInput } from "../types";

const defaultSettings: Settings = {
  siteName: "Jachu Muchi Admin",
  siteDescription: "Admin panel for Jachu Muchi",
  contactEmail: "admin@jachumuchi.com",
  maintenanceMode: false,
  registrationOpen: true,
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: SaveSettingsInput = { adminEmail: settings.contactEmail };
      await saveSettings(payload);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Manage application settings" />

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5"><Label>Site Name</Label><Input value={settings.siteName} onChange={(e) => handleChange("siteName", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Site Description</Label><Input value={settings.siteDescription} onChange={(e) => handleChange("siteDescription", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Contact Email</Label><Input value={settings.contactEmail} onChange={(e) => handleChange("contactEmail", e.target.value)} /></div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => handleChange("maintenanceMode", v)} />
            <Label>Maintenance Mode</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.registrationOpen} onCheckedChange={(v) => handleChange("registrationOpen", v)} />
            <Label>Registration Open</Label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button disabled={saving} onClick={() => void handleSave()}>
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
