"use client";

// import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type OrgMetadata = {
  public_email: string;
  public_phone: string;
  cover_image_path: string;
  cover_title: string;
  cover_description: string;
};

type AuthMeResponse = {
  ok: boolean;
  admin: {
    email: string;
    session_id: string;
    expires_at: string;
  };
  organization: OrgMetadata;
};

type UploadImageResponse = {
  ok: boolean;
  image: {
    path: string;
    public_url: string;
  };
};

type Notice = {
  type: "success" | "error";
  message: string;
};

const emptyOrg: OrgMetadata = {
  public_email: "",
  public_phone: "",
  cover_image_path: "",
  cover_title: "",
  cover_description: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingOrg, setSavingOrg] = useState(false);

  const [uploadingCover, setUploadingCover] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [sessionExpiresAt, setSessionExpiresAt] = useState("");
  const [org, setOrg] = useState<OrgMetadata>(emptyOrg);
  const [notice, setNotice] = useState<Notice | null>(null);

  const [
    currentPasswordForPasswordChange,
    setCurrentPasswordForPasswordChange,
  ] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswordForEmailChange, setCurrentPasswordForEmailChange] =
    useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const expiresLabel = useMemo(() => {
    if (!sessionExpiresAt) return "Unknown";
    return new Date(sessionExpiresAt).toLocaleString();
  }, [sessionExpiresAt]);

  useEffect(() => {
    let active = true;

    async function loadMe() {
      try {
        const res = await fetch("/api/admin/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to load dashboard.");

        const data = (await res.json()) as AuthMeResponse;
        if (!active) return;

        setAdminEmail(data.admin.email);
        setSessionExpiresAt(data.admin.expires_at);
        setOrg(data.organization);
      } catch {
        if (active)
          setNotice({ type: "error", message: "Could not load dashboard." });
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMe();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleUnauthorized(res: Response) {
    if (res.status === 401) {
      router.replace("/login");
      return true;
    }
    return false;
  }

  async function logoutCurrentSession() {
    setNotice(null);
    const res = await fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (await handleUnauthorized(res)) return;
    router.replace("/login");
  }

  async function logoutAllSessions() {
    setNotice(null);
    const res = await fetch("/api/admin/auth/logout-all", {
      method: "POST",
      credentials: "include",
    });

    if (await handleUnauthorized(res)) return;
    router.replace("/login");
  }

  async function uploadCoverImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch("/api/admin/uploads/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (await handleUnauthorized(uploadRes)) return;

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to upload image.");
      }

      const uploadData = (await uploadRes.json()) as UploadImageResponse;

      const nextOrg = {
        ...org,
        cover_image_path: uploadData.image.path,
      };

      setOrg(nextOrg);

      const saveRes = await fetch("/api/admin/organization", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextOrg),
      });

      if (await handleUnauthorized(saveRes)) return;

      if (!saveRes.ok) {
        throw new Error("Image uploaded, but organization was not updated.");
      }

      const saveData = await saveRes.json();
      setOrg(saveData.organization);

      setNotice({
        type: "success",
        message: "Cover image uploaded and saved.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not upload cover image.",
      });
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  }

  async function saveOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingOrg(true);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/organization", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });

      if (await handleUnauthorized(res)) return;
      if (!res.ok) throw new Error("Failed to update organization.");

      const data = await res.json();
      setOrg(data.organization);
      setNotice({ type: "success", message: "Organization metadata updated." });
    } catch {
      setNotice({
        type: "error",
        message: "Could not update organization metadata.",
      });
    } finally {
      setSavingOrg(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const res = await fetch("/api/admin/auth/change-password", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: currentPasswordForPasswordChange,
        new_password: newPassword,
      }),
    });

    if (await handleUnauthorized(res)) return;

    if (!res.ok) {
      setNotice({
        type: "error",
        message: "Could not change password. Check current password.",
      });
      return;
    }

    router.replace("/login");
  }

  async function changeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const res = await fetch("/api/admin/auth/change-email", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: currentPasswordForEmailChange,
        new_admin_email: newAdminEmail,
      }),
    });

    if (await handleUnauthorized(res)) return;

    if (!res.ok) {
      setNotice({
        type: "error",
        message: "Could not change email. Check current password.",
      });
      return;
    }

    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-300">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-white/5 p-6 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              DUSAU
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Admin Dashboard</h1>
          </div>

          <nav className="mt-8 space-y-2 text-sm">
            <a
              href="#overview"
              className="block rounded-xl bg-white px-4 py-3 font-medium text-slate-950"
            >
              Overview
            </a>
            <a
              href="#organization"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10"
            >
              Organization
            </a>
            <a
              href="#security"
              className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10"
            >
              Security
            </a>
            <div className="pt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
              Coming next
            </div>
            <span className="block rounded-xl px-4 py-2 text-slate-500">
              Committees
            </span>
            <span className="block rounded-xl px-4 py-2 text-slate-500">
              Alumni
            </span>
            <span className="block rounded-xl px-4 py-2 text-slate-500">
              Advisors
            </span>
            <span className="block rounded-xl px-4 py-2 text-slate-500">
              Gallery
            </span>
            <span className="block rounded-xl px-4 py-2 text-slate-500">
              Events
            </span>
          </nav>
        </aside>

        <section className="p-4 sm:p-6 lg:p-8">
          <div
            id="overview"
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm text-slate-400">Logged in as</p>
                <h2 className="mt-1 text-2xl font-semibold">{adminEmail}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Session expires: {expiresLabel}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={logoutCurrentSession}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Logout current session
                </button>
                <button
                  type="button"
                  onClick={logoutAllSessions}
                  className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-400"
                >
                  Logout all sessions
                </button>
              </div>
            </div>

            {notice && (
              <div
                className={`mt-6 rounded-xl px-4 py-3 text-sm ${
                  notice.type === "error"
                    ? "border border-red-400/40 bg-red-500/10 text-red-100"
                    : "border border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                }`}
              >
                {notice.message}
              </div>
            )}
          </div>

          <form
            id="organization"
            onSubmit={saveOrganization}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Organization Metadata</h2>
              <p className="mt-1 text-sm text-slate-300">
                This controls the public organization metadata endpoint.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Public email"
                value={org.public_email}
                onChange={(value) => setOrg({ ...org, public_email: value })}
              />
              <Input
                label="Public phone"
                value={org.public_phone}
                onChange={(value) => setOrg({ ...org, public_phone: value })}
              />
              {/* <Input
                label="Cover image path"
                value={org.cover_image_path}
                onChange={(value) =>
                  setOrg({ ...org, cover_image_path: value })
                }
              /> */}

              <label className="block">
                <span className="text-sm font-medium text-slate-200">
                  Cover image
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadCoverImage}
                  disabled={uploadingCover}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-slate-200 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-400">
                  {uploadingCover
                    ? "Uploading..."
                    : "Allowed: JPG, PNG, WEBP. Max size: 4MB."}
                </p>

                {org.cover_image_path && (
                  <p className="mt-2 break-all rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300">
                    Current path: {org.cover_image_path}
                  </p>
                )}
              </label>

              <Input
                label="Cover title"
                value={org.cover_title}
                onChange={(value) => setOrg({ ...org, cover_title: value })}
              />

              <label className="block lg:col-span-2">
                <span className="text-sm font-medium text-slate-200">
                  Cover description
                </span>
                <textarea
                  value={org.cover_description}
                  onChange={(event) =>
                    setOrg({ ...org, cover_description: event.target.value })
                  }
                  required
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={savingOrg}
              className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-60"
            >
              {savingOrg ? "Saving..." : "Save organization"}
            </button>
          </form>

          <section id="security" className="mt-6 grid gap-6 xl:grid-cols-2">
            <form
              onSubmit={changePassword}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold">Change Password</h2>
              <p className="mt-1 text-sm text-slate-300">
                This logs out every active session.
              </p>
              <div className="mt-5 space-y-4">
                <Input
                  label="Current password"
                  type="password"
                  value={currentPasswordForPasswordChange}
                  onChange={setCurrentPasswordForPasswordChange}
                />
                <Input
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                />
              </div>
              <button
                type="submit"
                className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
              >
                Change password
              </button>
            </form>

            <form
              onSubmit={changeEmail}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold">Change Admin Email</h2>
              <p className="mt-1 text-sm text-slate-300">
                This logs out every active session.
              </p>
              <div className="mt-5 space-y-4">
                <Input
                  label="Current password"
                  type="password"
                  value={currentPasswordForEmailChange}
                  onChange={setCurrentPasswordForEmailChange}
                />
                <Input
                  label="New admin email"
                  type="email"
                  value={newAdminEmail}
                  onChange={setNewAdminEmail}
                />
              </div>
              <button
                type="submit"
                className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
              >
                Change email
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white/30"
      />
    </label>
  );
}
