/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Admin from "./admin";
import Administrator from "~/components/administrator";

export const Dashboard: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);
  return (
    <div>
      <Nav />
      <Administrator />
      {/* Your dashboard content */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="w-full sm:w-96 xl:mt[150px] lg:mt-[150px] flex flex-col gap-5 bg-white rounded-2xl p-5 pt-2 pb-3">
          <div className="flex justify-between items-center">
          </div>
          {/* Dashboard content goes here */}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
