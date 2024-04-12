/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { urlBackend } from "../global";
import { MD5 } from "crypto-js";

export const ForgotPass: NextPage = () => {
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const newCode = useRef<HTMLInputElement>(null);
  const newPassword = useRef<HTMLInputElement>(null);
  const newRePassword = useRef<HTMLInputElement>(null);
  const [codeValue, setCodeValue] = useState('');
  const [codeBE, setCodeBE] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [askEmail, setAskEmail] = useState(false);
  const [validAccount, setValidAccount] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      displayMessage("", "");
    }, 3000);
    return () => clearTimeout(timeout);
  });

  const displayMessage = (type: any, message: any) => {
    setNotification({ type, message });
  };

  const verifyCode = () => {
    const enteredCode = newCode.current?.value;
    if (enteredCode === codeBE) {
      setNotification({ type: "success", message: 'Successfully verify, you can now change your password!!' });
      setValidAccount(true);
    }else{
      setNotification({ type: "error", message: "Wrong code, please check again!." });
    }
  }

  const checkValidAccount = async () => {
    const fUsername = username.current?.value.trim();
    const fEmail = email.current?.value.trim();

    if (!fUsername || !fEmail) {
      setNotification({ type: "error", message: "Please enter username and email." });
      return;
    }
    try {
      const response = await fetch(`${urlBackend}/users/validateAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fUsername,
          email: fEmail
        }),
      });

      if (response.ok) {
        setNotification({ type: "success", message: 'Email successfully sent, check your email and enter the code to continue.' });
        // setValidAccount(true);
        setAskEmail(true);
        const data = await response.json();
        setUserId(data.user.user_id);
        setCodeBE(data.code);
      } else {
        const data = await response.json();
        setNotification({ type: "error", message: `${data.message}` });
      }
    } catch (error) {
      console.error("Error validate account:", error);
      setNotification({ type: "error", message: "An error occurred while validate account." });
    }
  };

  const addNewPassword = async () => {
    const fNewPass = newPassword.current?.value.trim();
    const fConfirmNewPass = newRePassword.current?.value.trim();
    const hashPassword = fNewPass ? MD5(fNewPass).toString() : undefined;

    if (!fNewPass || !fConfirmNewPass) {
      setNotification({ type: "error", message: "Please enter password and confirm password." });
      return;
    } else if (fNewPass !== fConfirmNewPass) {
      setNotification({ type: "error", message: "Password must be the same with confirm password." });
      return;
    }
    try {
      const response = await fetch(`${urlBackend}/users/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          password: hashPassword
        }),
      });

      if (response.ok) {
        window.alert('Successfully update account');
        router.push('/login');
      } else {
        const data = await response.json();
        setNotification({ type: "error", message: `${data.message}` });
      }
    } catch (error) {
      console.error("Error change password in:", error);
      setNotification({ type: "error", message: "An error occurred while change password." });
    }
  };

  return (
    <div className="bg-gradient-to-tr from-white-200 to-white-500">
      <section
        id="forgotpassword"
        className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4"
      >
        <div className="rounded bg-gray-200 p-6">
          <div className="m-3 flex items-center justify-center text-4xl font-black text-sky-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-10 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
            <h1 className="tracking-wide text-3xl">
              Forgot Password<span className="font-mono">™</span>
            </h1>
          </div>
          {notification && (
            <div
              className={`p-3 text-sm rounded-md ${notification.type === "error"
                ? "bg-red-100 border border-red-300 text-red-900"
                : notification.type === "warning"
                  ? "bg-yellow-100 border border-yellow-300 text-yellow-900"
                  : notification.type === "success"
                    ? "bg-green-100 border border-green-300 text-green-900"
                    : ""
                }`}
            >
              {notification.message}
            </div>
          )}
          < div className="flex flex-col justify-center">
            {!validAccount && (
              <div>
                {!askEmail ? (
                  <div className="flex flex-col justify-center">
                    <label className="text-sm font-medium">Username</label>
                    <input
                      className="mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      type="text"
                      name="username"
                      placeholder="wahyusa"
                      required
                      ref={username}
                    />
                    <label className="text-sm font-medium">Email</label>
                    <input
                      className="mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      type="email"
                      name="email"
                      placeholder="example@gmail.com"
                      required
                      ref={email}
                    />
                    <button
                      className="mb-3 mt-2 flex items-center justify-center rounded-md bg-gray-600 px-2 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-gray-700"
                      onClick={() => {
                        void checkValidAccount();
                      }}
                    >
                      <span id="login_default_state">Verify Account</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center">
                    <label className="text-sm font-medium">Regenerate Code - 6 Characters Code</label>
                    <input
                      className="mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      type="text"
                      name="Code"
                      placeholder="ABCXYZ"
                      value={codeValue}
                      onChange={(e) => setCodeValue(e.target.value)}
                      required
                      ref={newCode}
                    />
                    <button
                      className="mb-3 mt-2 flex items-center justify-center rounded-md bg-gray-600 px-2 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-gray-700"
                      onClick={() => {
                        void verifyCode();
                      }}
                    >
                      <span id="login_default_state">Verify Code</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {validAccount && (
              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium">Password</label>
                <input
                  className="mb-3 mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 px-2 py-1.5 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                  type="password"
                  name="password"
                  placeholder="**********"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  required
                  ref={newPassword}
                />
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  className="mb-3 mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                  type="password"
                  name="confirmpassword"
                  placeholder="**********"
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  required
                  ref={newRePassword}
                />
                <button
                  className="mb-3 mt-2 flex items-center justify-center rounded-md bg-gray-600 px-2 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-gray-700"
                  onClick={() => {
                    void addNewPassword();
                  }}
                >
                  <span id="login_default_state">Change Password</span>
                </button>
              </div>
            )}
            <div className="flex justify-end">
              <a href="/register" className="flex justify-center p-2 border rounded border-gray-700 hover:text-white hover:bg-gray-500 mr-2">Sign Up</a>
              <a href="/login" className="flex justify-center p-2 border rounded border-gray-700 hover:text-white hover:bg-gray-500">Sign In</a>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
};

export default ForgotPass;
