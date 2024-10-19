"use client";

import { signOut } from "next-auth/react";
import { analytics } from "../../utils/analytics";

const LogoutButton = () => {
  const handleLogout = () => {
    signOut().then(() => analytics.track('LogOut'));
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
