import { getTwoFactorStatus } from "@/actions/auth-security"
import { SettingsDashboard } from "@/components/settings/settings-dashboard"

export default async function SettingsPage() {
    const twoFactorEnabled = await getTwoFactorStatus()

    return <SettingsDashboard twoFactorEnabled={twoFactorEnabled} />
}

