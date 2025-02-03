import { useState, useEffect, useCallback } from "react"
import { axiosInstance } from "@/Instance/axiosInstance"

interface Project {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

export interface CreateProjectPayload {
    name: string
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get("/project/get-projects")
            const data = await response.data.data
            setProjects(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch projects")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createProject = async (payload: CreateProjectPayload) => {
        const response = await axiosInstance.post("/project/create", {
            name: payload.name,
        })
        const newProject = response.data.data
        setProjects((prev) => [...prev, newProject])
        return newProject
    }
    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    return {
        projects,
        isLoading,
        error,
        createProject,
        refreshProjects: fetchProjects,
    }
}
