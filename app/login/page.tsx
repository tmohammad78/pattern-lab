import { getUsers } from "@/lib/content";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const users = getUsers();
  return <LoginForm users={users} />;
}
