"use client";

import { useState } from "react";
import TopNav from "@/app/components/dashboard/TopNav";
import { useSidebarToggle } from "@/app/(dashboard)/layout";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/components/ui/Toast";

export default function SettingsPage() {
  const toggleSidebar = useSidebarToggle();
  const { user } = useAuth();
  const toast = useToast();

  // Profile form
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setProfileSaving(true);
    try {
      // TODO: await put('/api/profile', { name });
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
    setProfileSaving(false);
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();

    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setPwdSaving(true);
    try {
      // TODO: await put('/api/password', { currentPassword: currentPwd, newPassword: newPwd });
      await new Promise((r) => setTimeout(r, 800));
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
    setPwdSaving(false);
  }

  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-indigo-500/50 focus:outline-none transition";

  return (
    <>
      <TopNav title="Settings" onMenuClick={toggleSidebar} />

      <div className="px-6 py-8 max-w-2xl mx-auto space-y-8">
        {/* ─── Profile ─── */}
        <form
          onSubmit={handleProfileSave}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <h3 className="font-medium text-white mb-5">Profile</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className={`${inputClass} opacity-50 cursor-not-allowed`}
              />
              <p className="text-xs text-zinc-600 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="mt-5 px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {profileSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* ─── Password ─── */}
        <form
          onSubmit={handlePasswordUpdate}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <h3 className="font-medium text-white mb-5">Change Password</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Current password</label>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">New password</label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Confirm new password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Confirm new password"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdSaving}
            className="mt-5 px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {pwdSaving ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* ─── Danger Zone ─── */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
          <h3 className="font-medium text-white mb-2">Danger Zone</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button className="px-4 py-2 text-sm font-medium text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition">
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
