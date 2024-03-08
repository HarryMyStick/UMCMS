/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Administrator from "~/components/administrator";

export const Dashboard: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    // Retrieve the user_id from the query parameters
    const { user_id } = router.query;

    // Check if user_id is defined before updating the state
    if (typeof user_id === 'string') {
      // Update the state with the user_id
      setUserId(user_id);
    }
  }, [router.query]);

  return (
    <div>
      <Nav />
      <Administrator />
      {/* Your dashboard content */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="w-full sm:w-96 xl:mt[150px] lg:mt-[150px] flex flex-col gap-5 bg-white rounded-2xl p-5 pt-2 pb-3">
          <div className="flex justify-between items-center">
          <h1>User ID: {userId}</h1>
          </div>
          {/* Dashboard content goes here */}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
