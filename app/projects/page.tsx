"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FolderPlus, Folder, MoreHorizontal, ArrowRight, Grid, LayoutList, Plus, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function ProjectsPage() {
    const { user, isAuthenticated, isLoading, createProject, deleteProject } = useAuth()
    const router = useRouter()
    const [newProjectName, setNewProjectName] = useState("")

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login?callbackUrl=/projects")
        }
    }, [isLoading, isAuthenticated, router])

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (newProjectName.trim()) {
            createProject(newProjectName)
            setNewProjectName("")
        }
    }

    if (isLoading || !isAuthenticated) return null

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-bold tracking-tight">Your Themed Projects</h1>
                    <p className="text-muted-foreground font-light">Organized groups of artistic discoveries.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-secondary/30 rounded-full p-1 border border-border/50">
                        <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 shadow-sm"><Grid className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-muted-foreground"><LayoutList className="w-4 h-4" /></Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Create New Project Card */}
                <Card className="rounded-[2.5rem] border-2 border-dashed border-border/50 bg-transparent hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col justify-center items-center py-12 text-center cursor-pointer">
                    <form onSubmit={handleCreate} className="w-full px-8 space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:bg-primary/10">
                            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">New Project</h3>
                            <input
                                type="text"
                                placeholder="Folder Name..."
                                className="w-full bg-transparent border-b border-border text-center text-sm py-1 focus:outline-none focus:border-primary transition-colors"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="ghost" size="sm" className="hidden">Create</Button>
                    </form>
                </Card>

                {user?.projects.map((project) => (
                    <Card key={project.id} className="rounded-[2.5rem] border-border/50 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-background relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-secondary flex items-center justify-center">
                                    <Folder className="w-6 h-6 text-primary" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full -mr-2">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border/50">
                                        <DropdownMenuItem
                                            className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
                                            onClick={() => deleteProject(project.id)}
                                        >
                                            <Trash2 className="mr-2 w-4 h-4" /> Delete Project
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                            <CardDescription>
                                {user.palettes.filter(p => p.projectId === project.id).length} Palettes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="flex -space-x-3 mb-8">
                                {user.palettes.filter(p => p.projectId === project.id).slice(0, 4).map((p, i) => (
                                    <div
                                        key={p.id}
                                        className="w-10 h-10 rounded-full border-4 border-white shadow-sm"
                                        style={{ backgroundColor: p.colors[0] }}
                                    />
                                ))}
                                {user.palettes.filter(p => p.projectId === project.id).length > 4 && (
                                    <div className="w-10 h-10 rounded-full border-4 border-white bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                        +{user.palettes.filter(p => p.projectId === project.id).length - 4}
                                    </div>
                                )}
                            </div>
                            <Link href={`/projects/${project.id}`}>
                                <Button variant="ghost" className="w-full justify-between h-12 rounded-xl border border-secondary hover:bg-secondary/50 hover:border-transparent transition-all group/btn px-4">
                                    View Project <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
