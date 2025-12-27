import { getTwoFactorStatus } from "@/actions/auth-security"
import { SettingsDashboard } from "@/components/settings/settings-dashboard"

export default async function SettingsPage() {
    const twoFactorStatus = await getTwoFactorStatus()

    return <SettingsDashboard twoFactorEnabled={twoFactorStatus.enabled} />
}

