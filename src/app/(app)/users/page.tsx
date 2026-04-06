"use client";

import CreateUserForm from "@/features/users/CreateUserForm";
import UserList from "@/features/users/UserList";

export default function Users() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <h1 className="text-center text-2xl font-bold sm:text-3xl">
        User Management
      </h1>
      <CreateUserForm />
      <UserList />
    </div>
  );
}
