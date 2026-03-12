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
    savePalette: (colors: string[], name?: string, projectId?: string) => Promise<void>
    deletePalette: (id: string) => Promise<void>
    createProject: (name: string) => Promise<void>
    deleteProject: (id: string) => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me")
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                }
            } catch (err) {
                console.error("Auth check failed:", err)
            } finally {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Login failed")

            setUser(data.user)
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (email: string, password: string, confirmPassword?: string) => {
        if (confirmPassword && password !== confirmPassword) {
            throw new Error("Passwords do not match")
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Registration failed")

            setUser(data.user)
        } finally {
            setIsLoading(false)
        }
    }

    const useDiscoveryAttempt = (palette?: string[]) => {
        if (!user) return false

        const isSubscribed = user.status === "subscribed"

        if (isSubscribed || user.attemptsRemaining > 0) {
            // Updated user state locally for immediate UI feedback
            // In a real app, you'd call an API to decrement attempts and save the palette
            if (palette) {
                savePalette(palette, `Discovery ${new Date().toLocaleDateString()}`)
            }

            if (!isSubscribed) {
                setUser({
                    ...user,
                    attemptsRemaining: user.attemptsRemaining - 1
                })
            }
            return true
        }

        return false
    }

    const savePalette = async (colors: string[], name?: string, projectId?: string) => {
        if (!user) return

        try {
            const res = await fetch("/api/palettes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ colors, name, projectId }),
            })

            if (res.ok) {
                const data = await res.json()
                setUser(prev => prev ? {
                    ...prev,
                    palettes: [data.palette, ...prev.palettes]
                } : null)
            }
        } catch (err) {
            console.error("Failed to save palette:", err)
        }
    }

    const createProject = async (name: string) => {
        if (!user) return

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            })

            if (res.ok) {
                const data = await res.json()
                setUser(prev => prev ? {
                    ...prev,
                    projects: [data.project, ...prev.projects]
                } : null)
            }
        } catch (err) {
            console.error("Failed to create project:", err)
        }
    }

    const deletePalette = async (id: string) => {
        try {
            const res = await fetch(`/api/palettes/${id}`, { method: "DELETE" })
            if (res.ok) {
                setUser(prev => prev ? {
                    ...prev,
                    palettes: prev.palettes.filter(p => p.id !== id)
                } : null)
            }
        } catch (err) {
            console.error("Failed to delete palette:", err)
        }
    }

    const deleteProject = async (id: string) => {
        try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
            if (res.ok) {
                setUser(prev => prev ? {
                    ...prev,
                    projects: prev.projects.filter(p => p.id !== id),
                    palettes: prev.palettes.filter(p => p.projectId !== id)
                } : null)
            }
        } catch (err) {
            console.error("Failed to delete project:", err)
        }
    }

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        setUser(null)
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
                deletePalette,
                createProject,
                deleteProject,
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
