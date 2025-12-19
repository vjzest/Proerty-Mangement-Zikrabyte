"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const router = useRouter();
  const { user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === "loading" || status === "idle") return;

    if (status === "succeeded" && !user) {
      router.replace("/login");
      return;
    }

    if (
      status === "succeeded" &&
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace("/"); // home ya dashboard
    }
  }, [user, status, allowedRoles, router]);

  if (status === "loading" || status === "idle") return <div>Loading...</div>;

  return <>{children}</>;
}
