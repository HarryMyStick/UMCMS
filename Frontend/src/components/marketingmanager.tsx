import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import JSZip from "jszip";

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

interface Magazine {
  sc_contribution_id: string;
  sc_article_title: string;
  sc_article_description: string;
  sc_article_content_url: string;
  sc_comment: string;
  sc_status: string;
  sc_image_url: string;
  p_first_name: string;
  p_last_name: string;
}

interface AcademicYear {
  academic_year_id: string;
  academic_year: string;
}


const MarketingManager: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [profile, setProfile] = useState<Profile | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedYear, setEditedYear] = useState("");

  const [publishMagazines, setPublishMagazines] = useState<Magazine[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedYearManage, setEditedYearManage] = useState("");


  const tabs = ["Home", "Manage Contribution","Profile"];
  const [activeTab, setActiveTab] = useState(() => {
    const storedTabIndex = sessionStorage.getItem("activeTabIndex");
    return storedTabIndex ? parseInt(storedTabIndex) : 0; 
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      displayMessage("", "");
    }, 3000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    if ((editedYear === "default") || (editedYear === "")) {
      showAllMagazine();
    } else {
      showAllMagazineByFacultyAndYear(editedYear);
    }
    if ((editedYearManage === "default") || (editedYearManage === "")) {
      showMagazineOfStudent();
    } else {
      showAllMagazineByFacultyAndYearNonPublish(editedYearManage);
    }
    fetchProfileData();
    getAcademicYear();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeTabIndex", activeTab.toString());
  }, [activeTab]);

  const handleChangeYear = (year: string) => {
    if ((year === "default") || (year === "")) {
      showAllMagazine();
    } else {
      showAllMagazineByFacultyAndYear(year);
    }
  }

  const handleChangeYearNonPublish = (year: string) => {
    if ((year === "default") || (year === "")) {
      showMagazineOfStudent();
    } else {
      showAllMagazineByFacultyAndYearNonPublish(year);
    }
  }

  const handleSaveStatus = async (index: number, contributionId: string, contributionStatus: string) => {
    if (contributionStatus !== "" && "default") {
      try {
        const response = await fetch(`${urlBackend}/contribution/updateStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contribution_id: contributionId,
            status: contributionStatus,
          }),
        });
        if (response.ok) {
          displayMessage("success", "Change status successfully.");
          showAllMagazine();
          showMagazineOfStudent();
          setEditingRowIndex(null);
          setEditedStatus("");
        } else {
          console.error("Error:", response.statusText);
          displayMessage("error", "Change status unsuccessfully due to some error.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  const handleEditStatus = (index: number) => {
    setEditingRowIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditedStatus("");
  };

  const handleDownloadAllFiles = async () => {
    try {
      const zip = new JSZip();
      // Iterate over publishMagazines and fetch files associated with each magazine
      for (const magazine of publishMagazines) {
        const response = await fetch(`${urlBackend}/contribution/getFile/${magazine.sc_article_content_url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const blob = await response.blob();
          // Add each file to the zip with a unique name
          zip.file(magazine.sc_article_title + ".docx", blob);
        } else {
          console.error(`Error downloading file for magazine ${magazine.sc_contribution_id}`);
        }
      }
      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then(function (content) {
        // Provide the user with a download link
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "magazines.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error("Error downloading all files:", error);
    }
  };

  const displayMessage = (type: any, message: any) => {
    setNotification({ type, message });
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const showMagazineOfStudent = async () => {
    try {
      const response = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const facultyName = data.faculty_name;
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getContributionsByFacultyNameApprove/${facultyName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (getMagazineResponse.ok) {
          const magazineData = await getMagazineResponse.json();
          for (const magazine of magazineData) {
            const getImageResponse = await fetch(`${urlBackend}/contribution/getImage/${magazine.sc_image_url}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });

            if (getImageResponse.ok) {
              const imageUrl = await getImageResponse.text();
              magazine.sc_image_url = imageUrl;
            }
          }
          setMagazines(magazineData);
          console.log('set magazine student');
        } else {
          console.log("Magazine cannot loading.");
          return;
        }
      } else {
        console.error("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const showAllMagazineByFacultyAndYearNonPublish = async (year: string) => {
    try {
      const response = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const facultyName = data.faculty_name;
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getContributionsByFacultyNameAndByYear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faculty_name: facultyName,
            year: year,
          }),
        });

        if (getMagazineResponse.ok) {
          const magazineData = await getMagazineResponse.json();
          for (const magazine of magazineData) {
            const getImageResponse = await fetch(`${urlBackend}/contribution/getImage/${magazine.sc_image_url}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });

            if (getImageResponse.ok) {
              const imageUrl = await getImageResponse.text();
              magazine.sc_image_url = imageUrl;
            }
          }
          setMagazines(magazineData);
        } else {
          console.log("Magazine cannot loading.");
          return;
        }
      } else {
        console.log("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const showAllMagazineByFacultyAndYear = async (year: string) => {
    try {
      const getMagazineResponse = await fetch(`${urlBackend}/contribution/getPublishContributionsByYear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: year,
        }),
      });

      if (getMagazineResponse.ok) {
        const magazineData = await getMagazineResponse.json();
        for (const magazine of magazineData) {
          const getImageResponse = await fetch(`${urlBackend}/contribution/getImage/${magazine.sc_image_url}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

          if (getImageResponse.ok) {
            const imageUrl = await getImageResponse.text();
            magazine.sc_image_url = imageUrl;
          }
        }
        setPublishMagazines(magazineData);
      } else {
        console.log("Magazine cannot loading.");
        return;
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const showAllMagazine = async () => {
    try {

      const getMagazineResponse = await fetch(`${urlBackend}/contribution/getAllContributionPublished`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (getMagazineResponse.ok) {
        const magazineData = await getMagazineResponse.json();
        for (const magazine of magazineData) {
          const getImageResponse = await fetch(`${urlBackend}/contribution/getImage/${magazine.sc_image_url}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

          if (getImageResponse.ok) {
            const imageUrl = await getImageResponse.text();
            magazine.sc_image_url = imageUrl;
          }
        }
        setPublishMagazines(magazineData);
      } else {
        console.log("Magazine cannot loading.");
        return;
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const getAcademicYear = async () => {
    try {
      const response = await fetch(`${urlBackend}/academicyear/getAllAcademicYear`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const academicYearData = await response.json();
        setAcademicYears(academicYearData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${urlBackend}/profile/getProfileByUserId/${userId}`
      );
      const data = await response.json();
      const {
        profile_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
      } = data;
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

  const handleSaveProfile = async () => {
    const fieldFirstName = firstName.current?.value.trim();
    const fieldLastName = lastName.current?.value.trim();
    const fieldEmail = email.current?.value.trim();
    const fieldPhoneNumber = phoneNumber.current?.value.trim();
    if (!fieldFirstName || !fieldLastName || !fieldEmail || !fieldPhoneNumber) {
      displayMessage("warning", "Please enter full information.");
      return;
    }
    try {
      const saveProfileResponse = await fetch(`${urlBackend}/profile/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: profile.profile_id,
          first_name: fieldFirstName,
          last_name: fieldLastName,
          email: fieldEmail,
          phone_number: fieldPhoneNumber
        }),
      });
      if (saveProfileResponse.ok) {
        setIsEditing(false);
        fetchProfileData();
        displayMessage("success", "Change profile successfully.");
      } else {
        displayMessage("error", "Change profile unsuccessfully due to some error.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  async function handleFileDownload(filename: string) {
    try {
      const response = await fetch(`${urlBackend}/contribution/getFile/${filename}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error downloading file:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

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
                      Home &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Magazine
                    </h1>
                  </div>
                </div>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12">
                  <div className="flex justify-end mb-4">
                    <select
                      className="text-center block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      defaultValue={"default"}
                      value={editedYear}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setEditedYear(selectedValue);
                        handleChangeYear(selectedValue);
                      }}
                    >
                      <option value="default">All Year</option>
                      {academicYears.map((year) => (
                        <option key={year.academic_year_id} value={year.academic_year}>
                          {year.academic_year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end mb-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleDownloadAllFiles}
                    >
                      Download All Files
                    </button>
                  </div>
                  <article>
                    <section className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                      {publishMagazines.map((publishMagazines) => (
                        <article key={publishMagazines.sc_contribution_id} className="bg-white group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform duration-200">
                          <div className="relative w-full h-80 md:h-64 lg:h-44">
                            <img
                              src={publishMagazines.sc_image_url}
                              alt={publishMagazines.sc_article_title}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                          <div className="px-3 py-4">
                            <h3 className="text-sm text-gray-500 pb-2">
                              <span className="bg-indigo-600 py-1 px-2 text-white rounded-lg">
                                Author: {publishMagazines.p_first_name + ' ' + publishMagazines.p_last_name}
                              </span>
                            </h3>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600"> {publishMagazines.sc_article_title}</h3>
                            <p className="text-base font-semibold text-gray-900 group-hover:text-indigo-600">
                              {publishMagazines.sc_article_description}
                            </p>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                              onClick={() => handleFileDownload(publishMagazines.sc_article_content_url)}
                            >
                              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M15.5 10l-5 5-5-5h3V4h4v6zm4.5 7H4v2h16v-2z" />
                              </svg>
                              Download Article
                            </button>
                          </div>
                        </article>
                      ))}
                    </section>
                  </article>
                </section>
              </div>
            )}
            {index === 1 &&
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Manage Contribution &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Contribution Table
                    </h1>
                  </div>
                </div>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12" >
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
                  <div className="flex justify-end mb-4">
                    <select
                      className="text-center block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      defaultValue={"default"}
                      value={editedYearManage}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setEditedYearManage(selectedValue);
                        handleChangeYearNonPublish(selectedValue);
                      }}
                    >
                      <option value="default">All Year</option>
                      {academicYears.map((year) => (
                        <option key={year.academic_year_id} value={year.academic_year}>
                          {year.academic_year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Image</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {magazines.map((magazine, index) => (
                        <tr key={magazine.sc_contribution_id} className="bg-white text-center">
                          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                            <div className="flex-shrink-0 h-20 w-20">
                              <img className="h-20 w-20 rounded-full" src={magazine.sc_image_url} alt={magazine.sc_article_title} />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-normal border-b border-gray-300">
                            <div className="text-sm font-medium text-gray-900">{magazine.sc_article_title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-normal border-b border-gray-300">
                            <div className="text-sm font-medium text-gray-900">{magazine.p_first_name} {magazine.p_last_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-normal border-b border-gray-300">
                            <div className="text-sm text-gray-900">{magazine.sc_article_description}</div>
                          </td>
                          <td className="px-2 py-2 relative w-1/6 text-center border-b border-gray-300">
                            {editingRowIndex === index ? (
                              <div className="flex items-center">
                                <select
                                  className="text-sm text-gray-900"
                                  defaultValue={"default"}
                                  value={editedStatus}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setEditedStatus(selectedValue);
                                  }}
                                >
                                  <option value="default">Select Status</option>
                                  <option value="Published">Published</option>
                                  <option value="Approved">Approved</option>
                                </select>
                                <button
                                  className="text-green-600 hover:text-green-900 p-1 mr-1"
                                  onClick={() => handleSaveStatus(index, magazine.sc_contribution_id, editedStatus)}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 p-1"
                                  onClick={() => handleCancelEdit()}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <div className="text-sm text-gray-900">{magazine.sc_status}</div>
                                <button
                                  className="absolute top-0 right-0 text-green-600 hover:text-green-900 p-1"
                                  onClick={() => handleEditStatus(index)}
                                >
                                  <svg
                                    className="w-5 h-5 mt-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium border-b border-gray-300">
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => handleFileDownload(magazine.sc_article_content_url)}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 10l-5 5-5-5h3V4h4v6zm4.5 7H4v2h16v-2z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            }
            {index === 2 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Profile information &gt;
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
                    <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                      {isEditing ? (
                        <div>
                          <div className="mb-0 rounded-t bg_nude px-6 py-6">
                            <div className="flex justify-between text-center ">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                My Account
                              </h6>
                              <button
                                className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => handleSaveProfile()}
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
                                onClick={() => handleEditProfile()}
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
        ))}
      </div>
    </div >
  );
};

export default MarketingManager;
