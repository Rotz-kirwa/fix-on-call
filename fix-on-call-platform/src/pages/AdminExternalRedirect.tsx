import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:8090";

const AdminExternalRedirect = () => {
  const { user, token } = useAuthStore();

  useEffect(() => {
    const url = new URL(`${ADMIN_APP_URL}/admin`);
    if (token) url.searchParams.set("token", token);
    if (user?.name) url.searchParams.set("name", user.name);
    if (user?.email) url.searchParams.set("email", user.email);
    if (user?.role) url.searchParams.set("role", user.role);
    window.location.replace(url.toString());
  }, [token, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-foreground">Opening Admin Command Center...</h1>
        <p className="text-sm text-muted-foreground mt-2">
          If redirect does not happen, open{" "}
          <a className="text-primary underline" href={`${ADMIN_APP_URL}/admin`}>
            {ADMIN_APP_URL}/admin
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminExternalRedirect;
