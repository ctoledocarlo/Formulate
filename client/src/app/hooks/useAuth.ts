import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(true);  // Track loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user", { credentials: "include" });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/signin");  // Redirect if not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/signin");
      } finally {
        setLoading(false);  // Mark loading as complete
      }
    };

    checkAuth();
  }, [router]);

  return { loading, isAuthenticated };
}
