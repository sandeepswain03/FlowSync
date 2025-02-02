import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { axiosInstance } from "@/axiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Menu} from "lucide-react"

interface User {
    _id: string
    email: string
    fullname: {
        firstname: string
        lastname: string
    }
}

interface Project {
    _id: string
    name: string
    createdAt: string
    updatedAt: string
    users: User[]
}

interface Message {
    id: string
    sender: { id: string; email: string }
    content: string
}

interface File {
    name: string
    content: string
}

const Project: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [project, setProject] = useState<Project | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [currentFile, setCurrentFile] = useState<string | null>(null)
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { register, handleSubmit, reset } = useForm<{ message: string }>()
    const location = useLocation()

    useEffect(() => {
        fetchAllUsers()
        fetchProject()
    }, [])

    const fetchProject = async () => {
        try {
            const response = await axiosInstance.get(`/project/get-project/${location.state?.project?._id}`)
            setProject(response.data.data)
        } catch (error) {
            console.log("Error fetching project:", error)
        }
    }

    const fetchAllUsers = async () => {
        try {
            const response = await axiosInstance.get("/user/allusers")
            setAllUsers(response.data.data)
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    }

    const onMessageSubmit = (data: { message: string }) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: { id: "current-user", email: "current@user.com" },
            content: data.message,
        }
        setMessages([...messages, newMessage])
        reset()
    }

    const filteredUsers = allUsers.filter(
        (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !project?.users.some((projectUser) => projectUser._id === user._id),
    )

    const toggleUserSelection = (user: User) => {
        setSelectedUsers((prev) =>
            prev.some((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user],
        )
    }

    const addCollaborators = async () => {
        try {
            await axiosInstance.put("/project/add-user", {
                projectId: project?._id,
                users: selectedUsers.map((user) => user._id),
            })
            setProject((prev) => (prev ? { ...prev, users: [...prev.users, ...selectedUsers] } : null))
            setSelectedUsers([])
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Error adding collaborators:", error)
        }
    }

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen w-screen flex bg-background">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="absolute top-4 left-4 z-10">
                        <Menu className="ri-menu-line mr-2" />
                        Menu
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>{project?.name || "Project Collaboration"}</SheetTitle>
                    </SheetHeader>
                    <Tabs defaultValue="chat" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chat">
                            <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="mb-4">
                                        <p className="text-sm text-muted-foreground">{msg.sender.email}</p>
                                        <p className="bg-secondary p-2 rounded-md">{msg.content}</p>
                                    </div>
                                ))}
                            </ScrollArea>
                            <form onSubmit={handleSubmit(onMessageSubmit)} className="mt-4 flex gap-2">
                                <Input {...register("message")} placeholder="Type a message..." />
                                <Button type="submit">Send</Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="collaborators">
                            <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border">
                                {project?.users.map((user) => (
                                    <div key={user._id} className="flex items-center p-4 hover:bg-accent">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.email} />
                                            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-2">
                                            <p className="font-medium">{`${user.fullname.firstname} ${user.fullname.lastname}`}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>

            <section className="flex-grow flex">
                <div className="w-64 bg-secondary p-4">
                    <h2 className="text-lg font-semibold mb-4">Files</h2>
                    <ScrollArea className="h-[calc(100vh-100px)]">
                        {files.map((file) => (
                            <Button
                                key={file.name}
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setCurrentFile(file.name)}
                            >
                                <i className="ri-file-text-line mr-2" />
                                {file.name}
                            </Button>
                        ))}
                    </ScrollArea>
                </div>

                <div className="flex-grow p-4">
                    {currentFile ? (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">{currentFile}</h2>
                            <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
                                <pre>{files.find((f) => f.name === currentFile)?.content}</pre>
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a file to view its content
                        </div>
                    )}
                </div>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="absolute bottom-4 right-4">
                        <i className="ri-user-add-line mr-2" />
                        Add Collaborator
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Collaborator</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className={`flex items-center justify-between p-2 cursor-pointer ${selectedUsers.some((u) => u._id === user._id) ? "bg-secondary" : ""
                                        }`}
                                    onClick={() => toggleUserSelection(user)}
                                >
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.email} />
                                            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{`${user.fullname.firstname} ${user.fullname.lastname}`}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    {selectedUsers.some((u) => u._id === user._id) && <X className="h-4 w-4 text-primary" />}
                                </div>
                            ))}
                        </ScrollArea>
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center"
                                >
                                    {`${user.fullname.firstname} ${user.fullname.lastname}`}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-1 h-4 w-4 p-0"
                                        onClick={() => toggleUserSelection(user)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full" onClick={addCollaborators} disabled={selectedUsers.length === 0}>
                            Add Collaborators
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.main>
    )
}

export default Project

