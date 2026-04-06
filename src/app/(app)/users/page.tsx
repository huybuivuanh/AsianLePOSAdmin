"use client";

import CreateUserForm from "@/features/users/CreateUserForm";
import UserList from "@/features/users/UserList";
import { PageHeader } from "@/components/layout/PageHeader";

export default function Users() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Users"
        description="Manage staff accounts, roles, and access to the POS admin."
      >
        <CreateUserForm />
      </PageHeader>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <UserList />
      </div>
    </div>
  );
}
