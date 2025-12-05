"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Trash2, UserPlus, Shield, ShieldAlert } from "lucide-react"

interface User {
    id: number
    name: string
    email: string
    role: string
    created_at: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [currentUserRole, setCurrentUserRole] = useState("")

    // New User Form State
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newRole, setNewRole] = useState("moderator")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { pastor } = await apiClient.request('/auth/me');
            setCurrentUserRole(pastor.role || 'moderator');

            if (pastor.role === 'admin') {
                const data = await apiClient.getUsers();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await apiClient.createUser({
                name: newName,
                email: newEmail,
                password: newPassword,
                role: newRole
            })

            // Reset form and refresh list
            setNewName("")
            setNewEmail("")
            setNewPassword("")
            setNewRole("moderator")
            setShowAddModal(false)
            fetchUsers()
        } catch (error) {
            console.error("Error adding user:", error)
            alert("Failed to create user. Please check inputs.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Note: Delete user is not yet implemented in backend/client fully if not requested, 
    // but requested requirements said "admin must me able to add another users... they cannot delete or add [moderators]"
    // It implies Admins CAN add. It doesn't explicitly say delete users, but good to have visualization.
    // For now I won't implement DELETE USER action unless requested, users page lists them and allows adding.

    if (isLoading) {
        return <div className="p-8">Loading users...</div>
    }

    if (currentUserRole !== 'admin') {
        return <div className="p-8 text-red-500">Access Denied. You must be an admin to view this page.</div>
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Team</h1>
                    <p className="text-gray-500 dark:text-gray-400">Add and view administrators and moderators.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <UserPlus size={20} />
                    Add User
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                            {user.role === 'admin' ? <ShieldAlert size={12} className="mr-1" /> : <Shield size={12} className="mr-1" />}
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add New Team Member</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${newRole === 'moderator'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:bg-muted'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="moderator"
                                            checked={newRole === 'moderator'}
                                            onChange={e => setNewRole(e.target.value)}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Shield size={20} className="mx-auto mb-1" />
                                            <span className="text-sm font-medium">Moderator</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${newRole === 'admin'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:bg-muted'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={newRole === 'admin'}
                                            onChange={e => setNewRole(e.target.value)}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <ShieldAlert size={20} className="mx-auto mb-1" />
                                            <span className="text-sm font-medium">Admin</span>
                                        </div>
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {newRole === 'admin'
                                        ? 'Admins have full access, including managing other users.'
                                        : 'Moderators can only approve/decline testimonies.'}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
