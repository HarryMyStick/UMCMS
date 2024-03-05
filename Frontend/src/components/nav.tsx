// Nav.tsx

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Nav: React.FC = () => {
    
    const router = useRouter();
  const handleLogout = () => {
    // Implement your logout functionality here
    // For example, clearing local storage or session
    router.push("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 py-4 px-8">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl font-semibold">My Dashboard</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard">
              <p className="text-white hover:text-gray-300">Home</p>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile">
              <p className="text-white hover:text-gray-300">Profile</p>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <p className="text-white hover:text-gray-300">Settings</p>
            </Link>
          </li>
          <li>
            <button
              className="rounded-md px-3 py-1 bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
