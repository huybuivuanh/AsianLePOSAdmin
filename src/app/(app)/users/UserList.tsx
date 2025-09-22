"use client";

import { useUsers } from "../../hooks/useUsers";

export default function UserList() {
  const { users, loading } = useUsers();

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                {user.createdAt.toDate().toISOString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
