"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to delete ALL quiz submissions? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/clear", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setStatus(data.message);
      } else {
        setStatus("Error: " + data.error);
      }
    } catch (error) {
      setStatus("Error clearing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-center mb-4">
          Admin
        </h1>
        <p className="text-gray-500 text-sm text-center mb-12">
          Manage quiz data
        </p>

        <div className="space-y-8">
          {/* Clear Data Section */}
          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg mb-2">Clear All Submissions</h2>
            <p className="text-gray-500 text-sm mb-6">
              Delete all quiz responses from the database. Use this before starting a new class session.
            </p>
            <button
              onClick={handleClearData}
              disabled={loading}
              className={`px-6 py-2.5 text-sm border rounded-full transition-colors ${
                loading
                  ? "border-gray-800 text-gray-600 cursor-not-allowed"
                  : "border-red-800 text-red-400 hover:text-red-300 hover:border-red-600"
              }`}
            >
              {loading ? "Clearing..." : "Clear All Data"}
            </button>

            {status && (
              <p className={`mt-4 text-sm ${status.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                {status}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link
                href="/result"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                View all submissions →
              </Link>
              <Link
                href="/"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Go to quiz →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
