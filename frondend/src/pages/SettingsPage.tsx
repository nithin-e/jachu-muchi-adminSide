import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2, Plus, X } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSettings,
  defaultAdminSettings,
  updateAdminEmail,
  updateNotificationEmails,
  updatePassword,
} from "@/api/services/settings.service";

const SAVED_TOAST_MS = 1600;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sectionCardClass =
  "rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-4 md:p-5";

type NotificationEmail = { id: string; email: string };

const SettingsPage = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [notificationEmails, setNotificationEmails] = useState<NotificationEmail[]>([]);
  const [notificationInput, setNotificationInput] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState<{ current: boolean; new: boolean; confirm: boolean }>({
    current: false,
    new: false,
    confirm: false,
  });

  const [adminEmailError, setAdminEmailError] = useState("");
  const [notificationError, setNotificationError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [adminEmailSaved, setAdminEmailSaved] = useState(false);
  const [notificationSaved, setNotificationSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loadError, setLoadError] = useState("");

  const adminEmailSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notificationSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (adminEmailSavedTimerRef.current) clearTimeout(adminEmailSavedTimerRef.current);
      if (notificationSavedTimerRef.current) clearTimeout(notificationSavedTimerRef.current);
      if (passwordSavedTimerRef.current) clearTimeout(passwordSavedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getSettings(controller.signal);
        if (cancelled) return;
        setAdminEmail(data.adminEmail);
        setNotificationEmails(data.notificationEmails);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        if (!cancelled) {
          console.error(e);
          setLoadError("Could not load settings.");
          setAdminEmail(defaultAdminSettings.adminEmail);
          setNotificationEmails([...defaultAdminSettings.notificationEmails]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const flashSaved = useCallback(
    (setter: React.Dispatch<React.SetStateAction<boolean>>, timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
      setter(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setter(false), SAVED_TOAST_MS);
    },
    [],
  );

  const handleSaveAdminEmail = useCallback(async () => {
    setAdminEmailError("");
    const trimmed = adminEmail.trim();
    if (!trimmed) {
      setAdminEmailError("Admin email is required");
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setAdminEmailError("Enter a valid email");
      return;
    }

    setSavingEmail(true);
    try {
      await updateAdminEmail(trimmed);
      flashSaved(setAdminEmailSaved, adminEmailSavedTimerRef);
    } catch (e) {
      console.error(e);
      setAdminEmailError("Could not save admin email. Please try again.");
    } finally {
      setSavingEmail(false);
    }
  }, [adminEmail, flashSaved]);

  const addNotificationEmail = useCallback(() => {
    const value = notificationInput.trim();
    if (!value || !emailRegex.test(value)) return;
    setNotificationEmails((prev) => [...prev, { id: `local-${Date.now()}`, email: value }]);
    setNotificationInput("");
    setNotificationError("");
  }, [notificationInput]);

  const removeNotificationEmail = useCallback((item: NotificationEmail) => {
    setNotificationEmails((prev) => prev.filter((x) => x.id !== item.id));
    setNotificationError("");
  }, []);

  const handleSaveNotifications = useCallback(async () => {
    setNotificationError("");

    const inputTrimmed = notificationInput.trim();
    const allEmails = [
      ...notificationEmails.map((item) => item.email.trim()),
      ...(inputTrimmed ? [inputTrimmed] : []),
    ];
    const filtered = allEmails.filter((email) => email && emailRegex.test(email));

    if (filtered.length === 0) {
      setNotificationError("At least 1 valid notification email is required");
      return;
    }

    setSavingNotifications(true);
    try {
      const saved = await updateNotificationEmails(filtered);
      setNotificationEmails(saved);
      setNotificationInput("");
      flashSaved(setNotificationSaved, notificationSavedTimerRef);
    } catch (e) {
      console.error(e);
      setNotificationError("Could not save notification emails. Please try again.");
    } finally {
      setSavingNotifications(false);
    }
  }, [notificationEmails, notificationInput, flashSaved]);

  const toggleReveal = useCallback((key: "current" | "new" | "confirm") => {
    setShowPassword((s) => ({ ...s, [key]: !s[key] }));
  }, []);

  const beginPasswordEdit = useCallback(() => {
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setEditPasswordMode(true);
    setShowPassword({ current: false, new: false, confirm: false });
  }, []);

  const cancelPasswordEdit = useCallback(() => {
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setEditPasswordMode(false);
    setShowPassword({ current: false, new: false, confirm: false });
  }, []);

  const handleSavePassword = useCallback(async () => {
    setPasswordError("");

    const cur = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmNewPassword.trim();

    if (!cur) {
      setPasswordError("Current password is required");
      return;
    }
    if (!next) {
      setPasswordError("New password is required");
      return;
    }
    if (next.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (next !== confirm) {
      setPasswordError("New password and confirmation do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword(cur, next);
      setPasswordError("");
      flashSaved(setPasswordSaved, passwordSavedTimerRef);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setEditPasswordMode(false);
      setShowPassword({ current: false, new: false, confirm: false });
    } catch (e) {
      console.error(e);
      setPasswordError("Could not update password. Check your current password and try again.");
    } finally {
      setSavingPassword(false);
    }
  }, [currentPassword, newPassword, confirmNewPassword, flashSaved]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
        <p className="text-sm">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Settings"
        description="Manage admin email, notifications, and password independently."
      />

      {loadError ? (
        <p className="text-sm text-amber-400">{loadError} Showing defaults.</p>
      ) : null}

      {/* Section 1 — Admin Email */}
      <div className={sectionCardClass}>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white/90">Admin Email</p>
            <p className="text-xs text-white/45 mt-0.5">
              The primary email address for the admin account.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/50">Email</Label>
            <Input
              type="email"
              value={adminEmail}
              onChange={(e) => {
                setAdminEmail(e.target.value);
                setAdminEmailError("");
              }}
            />
            {adminEmailError ? (
              <p className="text-sm text-amber-400" role="alert">
                {adminEmailError}
              </p>
            ) : null}
          </div>
          <Button type="button" disabled={savingEmail} onClick={() => void handleSaveAdminEmail()}>
            {savingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Email
          </Button>
          {adminEmailSaved ? (
            <span className="ml-3 text-xs font-medium text-green-400" aria-live="polite">
              ✓ Saved
            </span>
          ) : null}
        </div>
      </div>

      {/* Section 2 — Notification Emails */}
      <div className={sectionCardClass}>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white/90">Notification Emails</p>
            <p className="text-xs text-white/45 mt-0.5">
              Emails that will receive system notifications. Add or remove addresses below.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={notificationInput}
              onChange={(e) => {
                setNotificationInput(e.target.value);
                setNotificationError("");
              }}
              placeholder="Add notification email..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNotificationEmail();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addNotificationEmail}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {notificationEmails.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {notificationEmails.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80"
                >
                  {item.email}
                  <button
                    type="button"
                    onClick={() => removeNotificationEmail(item)}
                    className="rounded-full p-0.5 transition-colors hover:bg-white/10"
                    aria-label={`Remove ${item.email}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/35 italic">No notification emails added yet.</p>
          )}
          {notificationError ? (
            <p className="text-sm text-amber-400" role="alert">
              {notificationError}
            </p>
          ) : null}
          <Button type="button" disabled={savingNotifications} onClick={() => void handleSaveNotifications()}>
            {savingNotifications ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Notifications
          </Button>
          {notificationSaved ? (
            <span className="ml-3 text-xs font-medium text-green-400" aria-live="polite">
              ✓ Saved
            </span>
          ) : null}
        </div>
      </div>

      {/* Section 3 — Change Password */}
      <div className={sectionCardClass}>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white/90">Change Password</p>
            <p className="text-xs text-white/45 mt-0.5">
              Update your admin password. New password must be at least 8 characters.
            </p>
          </div>

          {!editPasswordMode ? (
            <Button type="button" variant="outline" onClick={beginPasswordEdit}>
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white/50">Current Password</Label>
                <div className="flex min-w-0 items-center gap-2">
                  <Input
                    className="min-w-0 flex-1"
                    type={showPassword.current ? "text" : "password"}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    aria-label={showPassword.current ? "Hide current password" : "Show current password"}
                    aria-pressed={showPassword.current}
                    onClick={() => toggleReveal("current")}
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-white/50">New Password</Label>
                <div className="flex min-w-0 items-center gap-2">
                  <Input
                    className="min-w-0 flex-1"
                    type={showPassword.new ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    aria-label={showPassword.new ? "Hide new password" : "Show new password"}
                    aria-pressed={showPassword.new}
                    onClick={() => toggleReveal("new")}
                  >
                    {showPassword.new ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-white/50">Confirm New Password</Label>
                <div className="flex min-w-0 items-center gap-2">
                  <Input
                    className="min-w-0 flex-1"
                    type={showPassword.confirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    aria-label={showPassword.confirm ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showPassword.confirm}
                    onClick={() => toggleReveal("confirm")}
                  >
                    {showPassword.confirm ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                  </Button>
                </div>
              </div>

              {passwordError ? (
                <p className="text-sm text-amber-400" role="alert">
                  {passwordError}
                </p>
              ) : null}

              <div className="flex items-center gap-3 pt-1">
                <Button type="button" disabled={savingPassword} onClick={() => void handleSavePassword()}>
                  {savingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Update Password
                </Button>
                <Button type="button" variant="outline" onClick={cancelPasswordEdit}>
                  Cancel
                </Button>
              </div>
              {passwordSaved ? (
                <span className="text-xs font-medium text-green-400" aria-live="polite">
                  ✓ Saved
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
