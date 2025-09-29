"use client";

import RegisterUserForm from "./RegisterUserForm";

import UserList from "./UserList";

export default function Users() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-center text-3xl font-bold">User Management</h1>
      <RegisterUserForm />
      <UserList />
    </div>
  );
}
