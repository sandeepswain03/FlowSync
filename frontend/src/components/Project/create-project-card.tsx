import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface CreateProjectCardProps {
    onClick: () => void
}

export function CreateProjectCard({ onClick }: CreateProjectCardProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
                className="relative rounded-lg border border-gray-200 bg-white p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center min-h-[200px]"
                onClick={onClick}
            >
                <div className="rounded-full bg-gray-100 p-3">
                    <Plus className="h-6 w-6 text-gray-600" />
                </div>
                <p className="mt-4 text-lg font-medium">Create application</p>
            </div>
        </motion.div>
    )
}

