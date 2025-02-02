import { useState } from "react"
import { CreateProjectDialog } from "../../components/Project/create-project-dialog"
import { CreateProjectCard } from "../../components/Project/create-project-card"
import { ProjectCard } from "../../components/Project/project-card"
import { useProjects } from "../../hooks/use-project"
import { Button } from "../../components/ui/button"

export default function DashboardPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { projects, isLoading, error, refreshProjects } = useProjects()

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-gray-500">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => refreshProjects()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-8">Applications</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CreateProjectCard onClick={() => setCreateDialogOpen(true)} />

        {isLoading
          ? // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[200px] rounded-lg bg-gray-100 animate-pulse" />
          ))
          : projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index + 1} // +1 because CreateProjectCard is first
            />
          ))}
      </div>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={refreshProjects}
      />
    </div>
  )
}

