import { useSession } from "next-auth/react"

export const useCurrentUser = () => {
    const { data: session } = useSession()
    return session?.user
}

export const useCurrentRole = () => {
    const { data: session } = useSession()
    return session?.user?.role
}
