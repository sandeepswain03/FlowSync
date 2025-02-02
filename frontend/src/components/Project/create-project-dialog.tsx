"use client"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { axiosInstance } from "@/axiosInstance"

interface CreateProjectPayload {
    name: string
}

interface CreateProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onProjectCreated: () => void
}

export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateProjectPayload>()

    const onSubmit = async (data: CreateProjectPayload) => {
        try {
            await axiosInstance.post("/project/create", {
                name: data.name,
            })
            reset()
            onOpenChange(false)
            onProjectCreated()
        } catch (err) {
            console.log(err instanceof Error ? err.message : "Failed to create project")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <Input
                            id="name"
                            {...register("name", {
                                required: "Project name is required",
                                minLength: {
                                    value: 1,
                                    message: "Project name is required",
                                },
                            })}
                            placeholder="My Application"
                        />
                        {errors.name && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500"
                            >
                                {errors.name.message}
                            </motion.p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

