import { motion } from "framer-motion"
import { User2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Project {
    _id: string
    name: string
    users: string[]
    createdAt: string
    updatedAt: string
}

interface ProjectCardProps {
    project: Project
    index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const navigate = useNavigate()
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="relative overflow-hidden p-6 hover:shadow-md transition-shadow duration-200"
                onClick={() => navigate("/project", { state: { project } })}>
                <div className="flex items-start justify-between">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm text-gray-600">{project.name.charAt(0)}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-medium text-lg">{project.name}</h3>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <User2 className="mr-2 h-4 w-4" />
                        {project.users.length}
                    </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>
            </div>
        </motion.div>
    )
}

