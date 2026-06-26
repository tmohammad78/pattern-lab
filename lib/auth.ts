"use client";

import bcrypt from "bcryptjs";
import type { Session, User } from "./types";

const SESSION_KEY = "pattern-lab-session";
const LOCAL_USERS_KEY = "pattern-lab-users";

function deriveName(email: string): string {
  const local = email.split("@")[0] ?? "User";
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLocalUsers(): User[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: User[]): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export async function login(
  email: string,
  password: string,
  users: User[]
): Promise<Session | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) return null;

  const staticUser = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (staticUser) {
    const valid = await bcrypt.compare(password, staticUser.passwordHash);
    if (!valid) return null;
    const session: Session = { email: staticUser.email, name: staticUser.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const localUsers = getLocalUsers();
  const localUser = localUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (localUser) {
    const valid = await bcrypt.compare(password, localUser.passwordHash);
    if (!valid) return null;
    const session: Session = { email: localUser.email, name: localUser.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = {
    email: normalizedEmail,
    name: deriveName(normalizedEmail),
    passwordHash,
  };
  saveLocalUsers([...localUsers, newUser]);

  const session: Session = { email: newUser.email, name: newUser.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
