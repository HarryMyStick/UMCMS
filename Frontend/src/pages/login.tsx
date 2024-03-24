/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { urlBackend } from "../global";
import { MD5 } from "crypto-js";

export const Login: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const logIn = async () => {
    const fieldUsername = username.current?.value.trim();
    const fieldPassword = password.current?.value.trim();
    const hashPassword = fieldPassword ? MD5(fieldPassword).toString() : undefined;

    if (!fieldUsername || !fieldPassword) {
      setErrorMessage("Please enter username and password.");
      return;
    }

    const existingSessionToken = localStorage.getItem("sessionId");
    if (existingSessionToken) {
      setErrorMessage("You are already logged in. Please logout from the existing account first.");
    } else {

      try {
        const response = await fetch(`${urlBackend}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: fieldUsername,
            password: hashPassword,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const getUserResponse = await fetch(`${urlBackend}/users/getUserByUsername/${fieldUsername}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (getUserResponse.ok) {
            const dataUser = await getUserResponse.json();
            const userId = dataUser.user_id;
            const roleName = dataUser.role.role_name;
            const { sessionId } = data; // Assuming the backend returns a session ID
            localStorage.setItem("sessionId", sessionId);
            await router.push({
              pathname: "/dashboard",
              query: { user_id: userId, role_name: roleName },
            });
          } else {
            setErrorMessage("Cannot Get UserId.");
          }
        } else {
          setErrorMessage("Invalid username or password.");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setErrorMessage("An error occurred while logging in.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-tr from-sky-200 to-sky-500">
      <section
        id="login"
        className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4"
      >
        <div className="rounded bg-sky-100 p-6">
          <div className="m-3 flex items-center justify-center text-4xl font-black text-sky-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-10 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
            <h1 className="tracking-wide">
              UMCMS<span className="font-mono">™</span>
            </h1>
          </div>
          {errorMessage && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-yellow-900 text-sm">
              {errorMessage}
            </div>
          )}
          < div
            className="flex flex-col justify-center"
          >
            <label className="text-sm font-medium">Username</label>
            <input
              className="mb-3 mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 px-2 py-1.5 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="text"
              name="username"
              placeholder="wahyusa"
              required
              ref={username}
            />
            <label className="text-sm font-medium">Password</label>
            <input
              className="mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="password"
              name="password"
              placeholder="********"
              required
              ref={password}
            />
            <button
              className="mt-3 block rounded-md bg-sky-600 px-4 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-sky-700"
              onClick={() => {
                void logIn();
              }}
            >
              <span id="login_default_state">Sign in</span>
            </button>
            <a href="/register" className="block w-full">
              <div className="mb-3 mt-2 flex items-center justify-center rounded-md bg-sky-600 px-2 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-sky-700">
                <span id="login_default_state">Create new account</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
