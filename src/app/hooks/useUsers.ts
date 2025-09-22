import { useState, useEffect } from "react";
import { getAllUsers } from "../lib/userService";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return { users, loading };
}
