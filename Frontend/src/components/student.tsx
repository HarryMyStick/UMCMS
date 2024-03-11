// Nav.tsx

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Header from "./header";


interface NavProps {
  userId: string;
}

interface Profile {
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_id: string;
}


const Student: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [titleValue, setTitleValue] = useState<string>('');
  const [descriptionValue, setDescriptionValue] = useState<string>('');
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [agree, setAgree] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgree(e.target.checked);
  };



  const handleEditProfile = (index: number) => {
    setEditingRowIndex(index);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  // start method reset form submit contributions
  const handleSentFile = async () => {
    try {
      await fetchUploadData(); // Gửi dữ liệu
      setAgree(false); // Đặt lại trạng thái của checkbox
      // setFormSent(true); // Đặt trạng thái của form thành đã gửi
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };

  const resetForm = async () => {
    // Đặt lại trạng thái của các trường trong form
    setWordFile(null);
    setImageFiles(null);
    setTitleValue('');
    setDescriptionValue('');

    // Đặt lại trạng thái của các trường khác nếu cần thiết
  };
  // end method reset form submit contributions

  const [wordFile, setWordFile] = useState<File | null | undefined>(null);
  const [imageFile, setImageFiles] = useState<File | null | undefined>(null);

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    // Implement your logout functionality here
    // For example, clearing local storage or session
    router.push("/login"); // Redirect to login page after logout
  };
  const tabs = ["Home", "Contribute articles", "Manage contributions", "Manage Profile"];
  const [activeTab, setActiveTab] = useState(0);

  //Start view profile
  useEffect(() => {
    fetchProfileData();
  }, []);
  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${urlBackend}/profile/getProfileByUserId/${userId}`
      );
      const data = await response.json(); // Parse response body as JSON
      const {
        profile_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
      } = data; // Destructure necessary fields
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setProfile({
        profile_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }
  //End view profile

  const handleSaveProfile = async (index: number) => {
    const fieldFirstName = firstName.current?.value.trim();
    const fieldLastName = lastName.current?.value.trim();
    const fieldEmail = email.current?.value.trim();
    const fieldPhoneNumber = phoneNumber.current?.value.trim();
    if (!fieldFirstName || !fieldLastName || !fieldEmail || !fieldPhoneNumber) {
      setErrorMessage("Please enter full information.");
      return;
    }
    try {
      const response = await fetch(`${urlBackend}/profile/updateProfile`, {
        method: "POST",
        body: JSON.stringify(
          {
            profile_id: profile.profile_id,
            first_name: fieldFirstName,
            last_name: fieldLastName,
            email: fieldEmail,
            phone_number: fieldPhoneNumber
          }
        ),
        headers: {
          "Content-Type": "application/json",
        },

      });
      if (response.ok) {
        setEditingRowIndex(null);
      } else {
        // Xử lý lỗi
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsEditing(false);
  };



  const handleClick = (index: number) => {
    setActiveTab(index);
  };




  // Start Upload

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg') {
        setImageFiles(selectedFile);
      } else {
        // Hiển thị thông báo hoặc thực hiện hành động phù hợp khi người dùng chọn loại file không hợp lệ
        setErrorMessage('Please select a PNG or JPEG image file.');
        event.target.value = ''; // Xóa giá trị file không hợp lệ khỏi trường nhập file
      }
    }
  };

  const handleWordFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        setWordFile(selectedFile);
      } else {
        // Hiển thị thông báo hoặc thực hiện hành động phù hợp khi người dùng chọn loại file không hợp lệ
        setErrorMessage('Please select a Word document file.');
        event.target.value = ''; // Xóa giá trị file không hợp lệ khỏi trường nhập file
      }
    }
  };

  const fetchUploadData = async () => {
    try {
      const fieldTitle = title.current?.value?.trim() || '';
      const fieldDescription = description.current?.value?.trim() || '';
      if (fieldTitle === "" || fieldDescription === "") {
        setErrorMessage("Please enter full information.");
      }
      const getAcademicYearId = await fetch(`${urlBackend}/academicyear/getAcademicYearByYear/2024`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (getAcademicYearId.ok) {
        const data = await getAcademicYearId.json();
        const academic_year_id = data.academic_year_id;
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("article_title", fieldTitle);
        formData.append("article_description", fieldDescription);
        formData.append("submission_date", "2024-03-09T12:00:00Z");
        formData.append("edit_date", "2024-03-09T12:00:00Z");
        formData.append("status", "Published");
        formData.append("academic_year_id", academic_year_id);
        formData.append("articleFile", wordFile as Blob);
        const createContribution = await fetch(`${urlBackend}/contribution/createContribution/`, {
          method: "POST",
          body: formData,
        });
        if (createContribution.ok) {
          const data = await createContribution.json(); // Assuming the response body contains JSON data
          const contributionId = data.contribution_id;
          const dataFormImage = new FormData();
          dataFormImage.append("contribution_id", contributionId);
          dataFormImage.append("imageFile", imageFile as Blob);

          const uploadImageResponse = await fetch(`${urlBackend}/contribution/uploadImage/`, {
            method: "POST",
            body: dataFormImage,
          });
          if (uploadImageResponse.ok) {
            // Image upload successful
          } else {
            setErrorMessage("Please enter full information.");
            return;
          }
        } else {
          // Handle error
        }
      }
    }
    catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  //End Upload

  return (
    <div className="flex flex-col bg_white">
      <div className="ml-10 mr-10 max-w-screen-2xl px-6 text-base">
        <nav className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-sky-950">
              <div className="flex h-1 w-auto items-center justify-center text-4xl font-black text-sky-1000">
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
            </div>
            <ul className="hidden flex-wrap items-center justify-center pl-24 text-base md:ml-auto md:mr-auto md:flex">
              {tabs.map((tab, index) => (
                <li key={index} className="me-2" role="presentation">
                  <button
                    onClick={() => handleClick(index)}
                    className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-red-400 hover:text-gray-600 dark:hover:text-gray-300 ${index === activeTab
                      ? "text-gray-600 dark:text-gray-900"
                      : ""
                      }`}
                    id="profile-tab-example"
                    type="button"
                    role="tab"
                    aria-controls="profile-example"
                    aria-selected={index === activeTab}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

          </div>
          <button
            className="ease rounded bg_red px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 hover:shadow-md focus:outline-none active:bg-teal-600"
            onClick={handleLogout}
          >Logout
          </button>
        </nav>
      </div>

      <div>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`mb-4 ${activeTab === index ? "block" : "hidden"}`}
          >
            {index === 0 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Home
                    </p>
                    <h1 className="mt-9 text-3xl font-semibold text-dark md:text-4xl">
                      Magazine <span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-12 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
            {index === 1 &&
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Contribute article
                    </p>
                    <h1 className="mt-9 text-3xl font-semibold text-dark md:text-4xl">
                      Contribute your article magazine<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-12 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                  <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                    <div className="mb-0 rounded-t bg_nude px-6 py-6">
                      <div className="flex items-center text-center">
                        <h6 className="text-blueGray-700 text-xl font-bold mr-auto">
                          My Contribution
                        </h6>
                        <button
                          onClick={() => handleSentFile()}
                          disabled={!agree}
                          className={`mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none ${!agree && 'opacity-50 cursor-not-allowed'
                            }`}
                          type="button"
                        >
                          Sent File
                        </button>
                        <button
                          onClick={() => resetForm()}
                          className={`rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none`}
                          type="button"
                        >
                          Clean Form
                        </button>
                      </div>
                    </div>

                    <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                      <form>
                        {errorMessage && (
                          <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-yellow-900 text-sm">
                            {errorMessage}
                          </div>
                        )}

                        <div className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                          <div className="flex flex-wrap">
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">

                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Title:
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  placeholder="Input Title"
                                  value={titleValue}
                                  onChange={(e) => setTitleValue(e.target.value)}
                                  ref={title}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="description">
                                  Description
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  placeholder="Input Description"
                                  value={descriptionValue}
                                  onChange={(e) => setDescriptionValue(e.target.value)}
                                  ref={description}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Upload Image File
                                </label>
                                <div className="mb-8">
                                  <input type="file" multiple name="imageFiles" id="imageFiles" className="sr-only" onChange={handleImageFileChange} />
                                  <label htmlFor="imageFiles" className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                                    <div>
                                      <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                        Drop Image file here
                                      </label>
                                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                        Or
                                      </span>
                                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                        Browse
                                      </span>
                                      <input
                                        type="file"
                                        name="imageFiles"
                                        id="imageFiles"
                                        className="sr-only"
                                        accept="image/png, image/jpeg" // Only PNG and JPEG images are allowed to be imported
                                        onChange={handleImageFileChange}
                                      />
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Upload Word File
                                </label>
                                <div className="mb-8">
                                  <input type="file" name="wordFile" id="wordFile" className="sr-only" onChange={handleWordFileChange} />
                                  <label htmlFor="wordFile" className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                                    <div>
                                      <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                        Drop Word file here
                                      </label>
                                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                        Or
                                      </span>
                                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                        Browse
                                      </span>
                                      <input
                                        type="file"
                                        name="wordFile"
                                        id="wordFile"
                                        className="sr-only"
                                        accept=".docx, .doc" // Chỉ cho phép nhập file Word
                                        onChange={handleWordFileChange}
                                      />
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Sellected image file:
                                </label>
                                {imageFile && <p>{imageFile.name}</p>}
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Sellected word file:
                                </label>
                                {wordFile && <p>{wordFile.name}</p>}
                              </div>
                            </div>
                            <div className="relative mb-3 w-full">
                              <label className="inline-flex items-center mt-3">
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-5 w-5 text-gray-600"
                                  checked={agree}
                                  onChange={handleAgreeChange}
                                  disabled={formSent} // Không vô hiệu hóa checkbox sau khi gửi
                                />
                                <span className="ml-2 text-gray-700">You can only submit Word files and PNG images, and please ensure that you are the author of the submitted content.</span>
                              </label>
                            </div>
                          </div>
                          <hr className="border-b-1 border-blueGray-300 mt-6" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            }
            {index === 2 &&
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Manage contributions
                    </p>
                    <h1 className="mt-9 text-3xl font-semibold text-dark md:text-4xl">
                      Manage my contributions <span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-12 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
            {/* Start View Profile */}
            {index === 3 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Profile information
                    </p>
                    <h1 className="mt-9 text-3xl font-semibold text-dark md:text-4xl">
                      Your profile information<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-12 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                    <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">

                      {editingRowIndex === index ? (
                        <div>
                          <div className="mb-0 rounded-t bg_nude px-6 py-6">
                            <div className="flex justify-between text-center ">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                My Account
                              </h6>
                              <button
                                className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => handleSaveProfile(index)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                          <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                            <form>
                              <h6 className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                                Manage Profile
                              </h6>
                              <div className="flex flex-wrap">
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="first_name"
                                    >
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.first_name}
                                      ref={firstName}
                                    />
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name"
                                    >
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.last_name}
                                      ref={lastName}
                                    />
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="email"
                                    >
                                      Email Address
                                    </label>
                                    <input
                                      type="text"
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.email}
                                      ref={email}
                                    />
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="phone_number"
                                    >
                                      Phone Number
                                    </label>
                                    <input
                                      type="text"
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.phone_number}
                                      ref={phoneNumber}
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-0 rounded-t bg_nude px-6 py-6">
                            <div className="flex justify-between text-center ">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                My Account
                              </h6>
                              <button
                                className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => handleEditProfile(index)}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                          <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                            <form>
                              <h6 className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                                Manage Profile
                              </h6>
                              <div className="flex flex-wrap">
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      First Name
                                    </label>
                                    <p>{profile.first_name}</p>
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      Last Name
                                    </label>
                                    <p>{profile.last_name}</p>
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      Email
                                    </label>
                                    <p>{profile.email}</p>
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      Phone Number
                                    </label>
                                    <p>{profile.phone_number}</p>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      <hr className="border-b-1 border-blueGray-300 mt-6" />
                    </div>

                  </div>

                </div>
              </div>
            )}
            {/* End View Profile */}
          </div>
        ))
        }
      </div >
    </div >
  );
};

export default Student;
