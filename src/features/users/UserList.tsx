import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import UpdateUserForm from "./UpdateUserForm";
import { Button } from "@/components/ui/button";

export default function UserList() {
  const { users, loading, deleteUser, subscribe } = useUserStore();

  useEffect(() => {
    const unsubscribe = subscribe();
    return () => unsubscribe();
  }, [subscribe]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUser(id);
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Loading users…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
              Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
              Email
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
              Role
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
              Created
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                No users yet. Use &quot;Add user&quot; to create the first
                account.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-muted/40"
              >
                <td className="px-3 py-3 font-medium text-foreground sm:px-4">
                  {user.name}
                </td>
                <td className="max-w-[12rem] px-3 py-3 break-words text-muted-foreground sm:max-w-none sm:px-4">
                  {user.email}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                  {user.createdAt.toDate().toLocaleString()}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <div className="flex flex-wrap gap-2">
                    <UpdateUserForm user={user} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
