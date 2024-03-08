
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { urlBackend } from "../global";

export const Register: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const registerUser = async () => {
    const fieldUsername = username.current?.value.trim();
    const fieldPassword = password.current?.value.trim();
    const fieldConfirmPassword = confirmPassword.current?.value.trim();
    
    if (!fieldUsername || !fieldPassword || !fieldConfirmPassword) {
      setErrorMessage("Please enter all required information.");
      return;
    }

    if (fieldPassword !== fieldConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${urlBackend}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: fieldUsername,
          password: fieldPassword
        })
      });

      if (response.ok) {
        await router.push('/login');
      } else if (response.status === 409) {
        setErrorMessage("This account already exists.");
      } else {
        throw new Error("Failed to register user.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      
      console.log("Error registering user:", error);
      setErrorMessage("An error occurred while registering.");
    }
  }

  return (
    <article className="fixed inset-0 z-30 flex flex-col bg-ln-custom p-7 transition duration-300">
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="w-full sm:w-96 xl:mt[150px] lg:mt-[150px] flex flex-col gap-5 bg-white rounded-2xl p-5 pt-2 pb-3">
          <div className="flex justify-center">
            <h2 className="font-bold text-3xl">Register</h2>
          </div>
          <div className="flex flex-col gap-2 text-black">
            <input
              className="common-input grow rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3"
              placeholder="Enter your full name"
              ref={username}
            />
            <input
              type="password"
              className="common-input grow rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3"
              placeholder="Enter password"
              ref={password}
            />
            <input
              type="password"
              className="common-input grow rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3"
              placeholder="Enter confirm password"
              ref={confirmPassword}
            />
            {errorMessage && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-yellow-900 text-sm">
                {errorMessage}
              </div>
            )}
          </div>
          <button
            className="rounded-2xl border-b-4 border-blue-500 bg-blue-950 py-4 my-2 font-bold uppercase text-white transition hover:brightness-110"
            onClick={() => {
              void registerUser();
            }}
          >
            {'Register'}
          </button>
        </div>
      </div>
    </article>
  );
};
export default Register;