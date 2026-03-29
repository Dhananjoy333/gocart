"use client";
export const dynamic = 'force-dynamic';
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Home() {
  useEffect(() => {
    const hasShown = sessionStorage.getItem("homeToastShown");

    if (!hasShown) {
      toast.custom((t) => (
        <div className="bg-zinc-100 p-4 rounded shadow flex items-center gap-4">
          <span>
            Login with given test credentials to access admin panel in {" "}
            <a
                href="/admin"
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded font-medium hover:underline"
            >
                /admin →
            </a>
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              sessionStorage.setItem("homeToastShown", "true");
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      ));
    }
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("homeToastShown");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <div>
      <Hero />
      <LatestProducts />
      <BestSelling />
      <OurSpecs />
      <Newsletter />
    </div>
  );
}
