import { useEffect } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import EditUserForm from "./UpdateUserForm";

export default function UserList() {
  const { users, loading, deleteUser, subscribe } = useUserStore();

  useEffect(() => {
    const unsubscribe = subscribe(); // start listening to Firestore
    return () => unsubscribe(); // cleanup on unmount
  }, [subscribe]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUser(id);
      alert("User deleted!");
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : ""}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <EditUserForm user={user} />
                <button
                  onClick={() => handleDelete(user.id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
