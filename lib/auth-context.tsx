"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Palette {
    id: string
    name: string
    colors: string[]
    createdAt: string
    projectId?: string
}

interface Project {
    id: string
    name: string
    createdAt: string
}

interface User {
    email: string
    status: "trial" | "subscribed"
    attemptsRemaining: number
    palettes: Palette[]
    projects: Project[]
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, confirmPassword?: string) => Promise<void>
    logout: () => void
    useDiscoveryAttempt: (palette?: string[]) => boolean
    savePalette: (colors: string[], name?: string, projectId?: string) => void
    createProject: (name: string) => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for user in localStorage on mount
        const storedUser = localStorage.getItem("pickerio-user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate fetching user with history
        const stored = localStorage.getItem(`pickerio-data-${email}`)
        const newUser: User = stored ? JSON.parse(stored) : {
            email,
            status: "trial",
            attemptsRemaining: 3,
            palettes: [],
            projects: []
        }
        setUser(newUser)
        localStorage.setItem("pickerio-user", JSON.stringify(newUser))
        setIsLoading(false)
    }

    const register = async (email: string, password: string, confirmPassword?: string) => {
        if (confirmPassword && password !== confirmPassword) {
            throw new Error("Passwords do not match")
        }

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newUser: User = {
            email,
            status: "subscribed",
            attemptsRemaining: 999,
            palettes: [],
            projects: []
        }
        setUser(newUser)
        localStorage.setItem("pickerio-user", JSON.stringify(newUser))
        localStorage.setItem(`pickerio-data-${email}`, JSON.stringify(newUser))
        setIsLoading(false)
    }

    const useDiscoveryAttempt = (palette?: string[]) => {
        if (!user) return false

        const isSubscribed = user.status === "subscribed"

        if (isSubscribed || user.attemptsRemaining > 0) {
            const updatedUser: User = {
                ...user,
                attemptsRemaining: isSubscribed ? user.attemptsRemaining : user.attemptsRemaining - 1,
                palettes: palette ? [
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        name: `Discovery ${new Date().toLocaleDateString()}`,
                        colors: palette,
                        createdAt: new Date().toISOString()
                    },
                    ...user.palettes
                ] : user.palettes
            }
            setUser(updatedUser)
            localStorage.setItem("pickerio-user", JSON.stringify(updatedUser))
            localStorage.setItem(`pickerio-data-${user.email}`, JSON.stringify(updatedUser))
            return true
        }

        return false
    }

    const savePalette = (colors: string[], name?: string, projectId?: string) => {
        if (!user) return
        const updatedUser: User = {
            ...user,
            palettes: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    name: name || `Palette ${user.palettes.length + 1}`,
                    colors,
                    createdAt: new Date().toISOString(),
                    projectId
                },
                ...user.palettes
            ]
        }
        setUser(updatedUser)
        localStorage.setItem("pickerio-user", JSON.stringify(updatedUser))
        localStorage.setItem(`pickerio-data-${user.email}`, JSON.stringify(updatedUser))
    }

    const createProject = (name: string) => {
        if (!user) return
        const updatedUser: User = {
            ...user,
            projects: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    createdAt: new Date().toISOString()
                },
                ...user.projects
            ]
        }
        setUser(updatedUser)
        localStorage.setItem("pickerio-user", JSON.stringify(updatedUser))
        localStorage.setItem(`pickerio-data-${user.email}`, JSON.stringify(updatedUser))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("pickerio-user")
        router.push("/")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                useDiscoveryAttempt,
                savePalette,
                createProject,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
