"use client";

import { useUserStore } from "@/stores/useUserStore";
import { UserForm } from "./UserForm";
import { formatTimestamp } from "@/lib/formatters";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import { RowActions, tableCardClass } from "@/components/layout/RowParts";

export function UserList() {
  // The listener is started by the users route layout.
  const { users, loading, deleteUser } = useUserStore();

  const handleDelete = async (user: User) => {
    if (
      !(await confirmDialog(`Delete "${user.name}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    try {
      await deleteUser(user.id!);
    } catch {
      await alertDialog("Couldn't delete user. Try again.");
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-foreground/60">Loading users…</p>
    );
  }

  return (
    <div className={`${tableCardClass} overflow-x-auto`}>
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-foreground/10 bg-foreground/[0.03]">
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
              Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
              Email
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
              Role
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
              Created
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-sm text-foreground/60"
              >
                No users yet. Use &quot;Add user&quot; to create the first
                account.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-foreground/[0.02]"
              >
                <td className="px-3 py-3 font-medium text-foreground sm:px-4">
                  {user.name}
                </td>
                <td className="max-w-[12rem] px-3 py-3 break-words text-foreground/60 sm:max-w-none sm:px-4">
                  {user.email}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span className="inline-flex rounded-full border border-foreground/15 px-2 py-0.5 text-xs font-medium text-foreground">
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-foreground/60 sm:px-4">
                  {formatTimestamp(user.createdAt)}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <RowActions name={user.name} onDelete={() => handleDelete(user)}>
                    <UserForm user={user} />
                  </RowActions>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
