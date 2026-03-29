"use client";
import { SignIn } from "@clerk/nextjs";

function page() {
  return (
    <div
      className="relative flex flex-col justify-center items-center overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      {/* Test Credentials */}
      <div className="mb-6 p-5 backdrop-blur-xl bg-white/70 dark:bg-black/50 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md">
        <p className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200 text-center">
          🔑 Test Credentials
        </p>

        <div className="space-y-4">
          {/* Admin */}
          <div className="p-3 rounded-xl bg-linear-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-800">
            <p className="text-md font-semibold text-purple-700 dark:text-purple-300 mb-1">
              👑 Admin
            </p>
            <p className="font-mono text-sm">
              📧 testeradmin+clerk_test@example.com
            </p>
            <p className="font-mono text-sm">🔒 Admin@36912#</p>
            <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">
              Access to admin dashboard
            </p>
          </div>

          {/* Store */}
          <div className="p-3 rounded-xl bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800">
            <p className="text-md font-semibold text-green-700 dark:text-green-300 mb-1">
              🏪 Store Owner
            </p>
            <p className="font-mono text-sm">📧 store+clerk_test@example.com</p>
            <p className="font-mono text-sm">🔒 Store36912</p>
            <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">
              Has 1 store created
            </p>
          </div>

          {/* User */}
          <div className="p-3 rounded-xl bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800">
            <p className="text-md font-semibold text-blue-700 dark:text-blue-300 mb-1">
              👤 User
            </p>
            <p className="font-mono text-sm">📧 user+clerk_test@example.com</p>
            <p className="font-mono text-sm">🔒 User36912</p>
            <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">
              Normal user (no store yet)
            </p>
          </div>
        </div>
      </div>

      {/* Clerk SignIn */}
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}

export default page;
