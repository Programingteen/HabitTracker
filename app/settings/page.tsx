import Link from "next/link";
import AuthenticatedShell from "@/components/app/AuthenticatedShell";
import { getUserSettings } from "@/lib/settings/data";
import EditableName from "@/components/settings/EditableName";
import PreferenceSelect from "@/components/settings/PreferenceSelect";
import DataActions from "@/components/settings/DataActions";
import SignOutButton from "@/components/dashboard/SignOutButton";
import {
  saveWeekStartsOn,
  saveProgressRange,
} from "./actions";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <AuthenticatedShell name={settings.name}>
      <div className="mx-auto max-w-2xl px-6 py-12 lg:py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Settings
          </h1>
          <p className="mt-2 text-zinc-500">
            Manage your account, preferences, and HabitTracker.
          </p>
        </header>

        <div className="space-y-12">
          {/* Account */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Account
            </h2>

            <div className="divide-y divide-zinc-100 rounded-3xl border border-zinc-200 bg-white px-6 shadow-sm">
              <div className="py-5">
                <p className="mb-1 text-xs text-zinc-500">Name</p>
                <EditableName initialName={settings.name} />
              </div>

              <div className="py-5">
                <p className="mb-1 text-xs text-zinc-500">Email</p>
                <p className="text-[15px] font-medium text-zinc-400">
                  {settings.email}
                </p>
                <p className="mt-1 text-[11px] italic text-zinc-400">
                  Email is read-only.
                </p>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Preferences
            </h2>

            <div className="divide-y divide-zinc-100 rounded-3xl border border-zinc-200 bg-white px-6 shadow-sm">
              <div className="py-5">
                <PreferenceSelect
                  label="Theme"
                  description="Choose how HabitTracker looks to you."
                  value="system"
                  options={[
                    { label: "System", value: "system" },
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                  ]}
                />
              </div>

              <div className="py-5">
                <PreferenceSelect
                  label="Week starts on"
                  description="Choose which day starts your weekly overview."
                  value={settings.week_starts_on}
                  options={[
                    { label: "Monday", value: "monday" },
                    { label: "Sunday", value: "sunday" },
                  ]}
                  onSave={saveWeekStartsOn}
                />
              </div>

              <div className="py-5">
                <PreferenceSelect
                  label="Default Progress range"
                  description="The default time range shown in your progress views."
                  value={settings.default_progress_range}
                  options={[
                    { label: "7 days", value: 7 },
                    { label: "30 days", value: 30 },
                    { label: "90 days", value: 90 },
                  ]}
                  onSave={saveProgressRange}
                />
              </div>
            </div>
          </section>

          {/* Goals */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Goals
            </h2>

            <Link
              href="/goals"
              className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white px-6 py-5 shadow-sm transition hover:border-zinc-300"
            >
              <div>
                <p className="text-[15px] font-medium text-zinc-900">
                  Manage goals
                </p>
                <p className="text-[13px] text-zinc-500">
                  Manage your goals and create new ones.
                </p>
              </div>

              <span className="text-zinc-400">→</span>
            </Link>
          </section>

          {/* Data & Privacy */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Data & Privacy
            </h2>

            <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
              <DataActions />
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              About
            </h2>

            <div className="divide-y divide-zinc-100 rounded-3xl border border-zinc-200 bg-white px-6 shadow-sm">
              <div className="flex items-center justify-between py-5">
                <span className="text-[15px] font-medium text-zinc-900">
                  HabitTracker
                </span>
                <span className="text-xs text-zinc-400">v1.0.0</span>
              </div>

              <div className="py-5">
                <button className="text-[15px] font-medium text-zinc-600 hover:text-zinc-900">
                  Send feedback
                </button>
              </div>

              <div className="py-5">
                <Link
                  href="#"
                  className="text-[15px] font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Privacy Policy
                </Link>
              </div>

              <div className="py-5">
                <Link
                  href="#"
                  className="text-[15px] font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </section>

          {/* Sign out */}
          <div className="flex justify-center pt-4">
            <SignOutButton />
          </div>
        </div>
      </div>
    </AuthenticatedShell>
  );
}