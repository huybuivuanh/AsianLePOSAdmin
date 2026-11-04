"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import CreateUserForm from "@/features/users/CreateUserForm";
import UserList from "@/features/users/UserList";
import { useUserStore } from "@/stores/useUserStore";

export default function UsersPage() {
  const users = useUserStore((s) => s.users);
  const loading = useUserStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PageHeader title="Users" count={loading && users.length === 0 ? undefined : users.length}>
        <CreateUserForm />
      </PageHeader>
      <UserList />
    </div>
  );
}
