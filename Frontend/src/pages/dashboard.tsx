/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Student from "../components/student";
import Administrator from "~/components/administrator";
import Mkcoordinator from "~/components/mkcoordinator";
import MarketingManager from "~/components/marketingmanager";
import Guest from "~/components/guest";

export const Dashboard: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [roleName, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    const { user_id, role_name } = router.query;

    if (typeof user_id === 'string') {
      setUserId(user_id);
    }

    if (typeof role_name === 'string') {
      setUserRole(role_name);
    }
  }, [router.query.user_id, router.query.role_name]);

  let dashboardContent;
  switch (roleName) {
    case "Student":
      dashboardContent = <Student userId={userId} />;
      break;
    case "Marketing Coordinator":
      dashboardContent = <Mkcoordinator userId={userId} />;
      break;
    case "Admin":
      dashboardContent = <Administrator userId={userId} />;
      break;
    case "Marketing Manager":
      dashboardContent = <MarketingManager userId={userId} />;
      break;
    case "Guest":
      dashboardContent = <Guest userId={userId} />;
      break;
    default:
      dashboardContent = null;
  }

  return (
    <div>
      {dashboardContent}
      {/* Your dashboard content */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="w-full sm:w-96 xl:mt[150px] lg:mt-[150px] flex flex-col gap-5 bg-white rounded-2xl p-5 pt-2 pb-3">
          <div className="flex justify-between items-center">
            <h1>User ID: {userId}</h1>
            <h2>Role Name: {roleName}</h2>
          </div>
          {/* Dashboard content goes here */}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
