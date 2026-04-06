import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import UpdateUserForm from "./UpdateUserForm";

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
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="-mx-1 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[36rem] border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-2 py-2 text-left sm:px-4">Name</th>
            <th className="border px-2 py-2 text-left sm:px-4">Email</th>
            <th className="border px-2 py-2 text-left sm:px-4">Role</th>
            <th className="border px-2 py-2 text-left sm:px-4">Created</th>
            <th className="border px-2 py-2 text-left sm:px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-2 py-2 sm:px-4">{user.name}</td>
              <td className="max-w-[12rem] break-words border px-2 py-2 sm:max-w-none sm:px-4">
                {user.email}
              </td>
              <td className="border px-2 py-2 sm:px-4">{user.role}</td>
              <td className="whitespace-nowrap border px-2 py-2 sm:px-4">
                {user.createdAt.toDate().toLocaleString()}
              </td>
              <td className="border px-2 py-2 sm:px-4">
                <div className="flex flex-wrap gap-2">
                  <UpdateUserForm user={user} />
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id!)}
                    className="rounded bg-red-500 px-2 py-1 text-white sm:px-3"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
