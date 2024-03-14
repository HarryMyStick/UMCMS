import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Chart from 'chart.js/auto';

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

interface AcademicYear {
  academic_year_id: string;
  academic_year: string;
  closure_date: Date;
  final_closure_date: Date;
}

interface User {
  user_id: string;
  username: string;
  role: Role;
}

interface Role {
  role_id: string;
  role_name: string;
}

const Administrator: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [profile, setProfile] = useState<Profile | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear>();
  const [academicYearsAR, setAcademicYearsAR] = useState<AcademicYear[]>([]);
  const [editedYear, setEditedYear] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [closureDate, setClosureDate] = useState(new Date());
  const [finalClosureDate, setFinalClosureDate] = useState(new Date());

  const [userList, setUserList] = useState<User[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const tabs = ["Manage Closure Date", "Manage Accounts", "Statistical Analysis", "Profile"];
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
    fetchProfileData();
    getAcademicYear();
    getAllUser();
    getAllRole();
    if (editedYear) {
      fetchDataChart(editedYear);
    } else {
      fetchDataChart('2024');
    }
    getAllAcademicYear();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeTabIndex", activeTab.toString());
  }, [activeTab]);

  const displayMessage = (type: any, message: any) => {
    setNotification({ type, message });
  };

  const handleYearChange = (selectedYear: string) => {
    setEditedYear(selectedYear);
    fetchDataChart(selectedYear);
  }

  const handleEditModeToggle = () => {
    setEditMode((prevEditMode) => !prevEditMode);
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

  const handleEditRole = (index: number) => {
    setEditingRowIndex(index);
  };

  const handleStopEditRole = (user_id: string, roleName: string) => {
    setEditingRowIndex(null);
    updateAccountRole(user_id, roleName);
  };

  const handleRoleChange = (roleName: string, index: number) => {
    setUserList(prevUserList => {
      const updatedUserList = [...prevUserList];
      const userToUpdate = updatedUserList[index];
      if (userToUpdate) {
        updatedUserList[index] = {
          ...userToUpdate,
          role: {
            ...userToUpdate.role,
            role_name: roleName,
          },
        };
      }
      return updatedUserList;
    });
  };

  const handleDeleteAccount = async (user: User) => {
    // Display an alert to confirm deletion
    if (window.confirm(`Are you sure you want to delete the account for ${user.username}?`)) {
      try {
        const response = await fetch(`${urlBackend}/users/deleteUser/${user.user_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setEditingRowIndex(null);
          getAllUser();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      console.log(`Deleting account for ${user.username}...`);
    } else {
      // If user cancels, do nothing
      console.log("Deletion cancelled.");
    }
  }

  const adjustTimezone = (dateString: Date) => {
    const date = new Date(dateString);

    const offset = -7 * 60;
    const adjustedDate = new Date(date.getTime() + offset * 60 * 1000);

    return adjustedDate;
  };

  const adjustTimezoneback = (dateString: Date) => {
    const date = new Date(dateString);

    const offset = +7 * 60;
    const adjustedDate = new Date(date.getTime() + offset * 60 * 1000);

    return adjustedDate;
  };

  const format24hTime = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const updateAccountRole = async (user_id: string, role_name: string) => {
    try {
      const response = await fetch(`${urlBackend}/users/updateUserRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          role_name: role_name
        })
      });
      if (response.ok) {
        setEditingRowIndex(null);
        console.log(user_id);
        console.log(role_name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const fetchDataChart = async (year: string) => {
    try {
      // Fetch contribution statistics
      const contributionResponse = await fetch(`${urlBackend}/contribution/statisticContributionPerYear/${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!contributionResponse.ok) {
        throw new Error('Failed to fetch contribution statistics');
      }
      const contributionData = await contributionResponse.json();

      // Fetch contributor statistics
      const contributorResponse = await fetch(`${urlBackend}/contribution/statisticContributorsPerYear/${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!contributorResponse.ok) {
        throw new Error('Failed to fetch contributor statistics');
      }
      const contributorData = await contributorResponse.json();

      // Render Count Contribution Chart

      const countsContribution = contributionData.map((item: { contributionCount: any; }) => item.contributionCount);
      const labelsContribution = contributionData.map((item: { facultyName: any; academicYear: any; }) => `${item.facultyName} (${item.academicYear})`);

      const canvasContribution = document.getElementById("myChartCounts") as HTMLCanvasElement;
      // canvasContribution.width = 800;
      // canvasContribution.height = 400;
      if (canvasContribution) {
        Chart.getChart(canvasContribution)?.destroy();
        new Chart(canvasContribution, {
          type: 'bar',
          data: {
            labels: labelsContribution,
            datasets: [{
              label: 'Contribution Count',
              data: countsContribution,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              
              borderColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderWidth: 1,
            }]
          },
          options: {
            scales: {
              y: {
                ticks: {
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: {
                display: false // Hide the legend
              }
            }
          }
        });
      }

      // Render Count Contribution Percentage Chart

      const countsContributionPercentage = contributionData.map((item: { contributionCount: any; }) => item.contributionCount);
      const labelsContributionPercentage = contributionData.map((item: { facultyName: any; academicYear: any; }) => `${item.facultyName} (${item.academicYear})`);

      const canvasContributionPercentage = document.getElementById("myChartPercentages") as HTMLCanvasElement;
      if (canvasContributionPercentage) {
        Chart.getChart(canvasContributionPercentage)?.destroy();
        new Chart(canvasContributionPercentage, {
          type: 'doughnut',
          data: {
            labels: labelsContributionPercentage,
            datasets: [{
              label: 'Contribution Percentage',
              data: countsContributionPercentage,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],              
              hoverOffset: 4
            }]
          }
        });
      }

      // Render Contributor Chart

      const countsContributor = contributorData.map((item: { contributorCount: any; }) => item.contributorCount);
      const labelsContributor = contributorData.map((item: { facultyName: any; academicYear: any; }) => `${item.facultyName} (${item.academicYear})`);

      const canvasContributor = document.getElementById("myChartContributors") as HTMLCanvasElement;
      if (canvasContributor) {
        Chart.getChart(canvasContributor)?.destroy();
        new Chart(canvasContributor, {
          type: 'doughnut',
          data: {
            labels: labelsContributor,
            datasets: [{
              label: 'Contributior',
              data: countsContributor,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                // Add more colors as needed
              ],
              hoverOffset: 4
            }]
          }
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllUser = async () => {
    try {
      const response = await fetch(`${urlBackend}/users/getAllUserWithRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserList(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const getAllRole = async () => {
    try {
      const response = await fetch(`${urlBackend}/role/getRoles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const getAllAcademicYear = async () => {
    try {
      const response = await fetch(`${urlBackend}/academicyear/getAllAcademicYear`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAcademicYearsAR(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  const getAcademicYear = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(`${urlBackend}/academicyear/getAcademicYearByYear/${currentYear}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClosureDate(adjustTimezone(new Date(data.closure_date)));
        setFinalClosureDate(adjustTimezone(new Date(data.final_closure_date)));
        setAcademicYears(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  const handleSaveDates = async () => {
    try {
      if (finalClosureDate < closureDate) {
        setNotification({ type: "error", message: "Final closure date must be equal to or greater than the closure date." });
        return;
      }

      const formattedClosureDate = adjustTimezoneback(closureDate);
      const formattedFinalClosureDate = adjustTimezoneback(finalClosureDate);

      const response = await fetch(`${urlBackend}/academicyear/updateAcadamicYear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year_id: academicYears?.academic_year_id,
          closure_date: formattedClosureDate,
          final_closure_date: formattedFinalClosureDate,
        }),
      });
      if (response.ok) {
        setEditMode(false);
        getAcademicYear();
        setNotification({ type: "success", message: "Dates saved successfully." });
      } else {
        setNotification({ type: "error", message: "Failed to save dates." });
        getAcademicYear();
      }
    } catch (error) {
      console.error("Error saving dates:", error);
      setNotification({ type: "error", message: "Failed to save dates." });
    }
  };


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
              <div className="max-w-screen-xl mx-auto px-4">
                <h1 className="text-3xl font-semibold mb-4">Manage Closure Date</h1>
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
                  {editMode ? (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      onClick={handleSaveDates}
                    >
                      Save Changes
                    </button>
                  ) :
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      onClick={handleEditModeToggle}
                    >
                      Edit Date
                    </button>
                  }
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <p className="text-lg font-semibold mb-2">Academic Year:</p>
                    <p className="text-xl">2024-2025</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <p className="text-lg font-semibold mb-2">Closure Date:</p>
                    {editMode ? (
                      <div className="relative">
                        <input
                          type="datetime-local"
                          className="w-full bg-gray-100 border rounded p-2"
                          value={format24hTime(closureDate)}
                          onChange={(e) => setClosureDate(new Date(e.target.value))}
                        />

                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <p className="text-xl">
                            {closureDate.toDateString()} {closureDate.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <p className="text-lg font-semibold mb-2">Final Closure Date:</p>
                    {editMode ? (
                      <div className="relative">
                        <input
                          type="datetime-local"
                          className="w-full bg-gray-100 border rounded p-2"
                          value={finalClosureDate.toISOString().slice(0, 16)}
                          onChange={(e) => setFinalClosureDate(new Date(e.target.value))}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <p className="text-xl">
                            {finalClosureDate.toDateString()} {finalClosureDate.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {index === 1 && (
              <div className="max-w-screen-xl mx-auto px-4">
                <h1 className="text-3xl font-semibold mb-4">Manage User Accounts</h1>
                <button
                  onClick={getAllUser}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Refresh
                </button>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Actions</th> {/* New column for actions */}
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-2">{user.username}</td>
                          <td className="px-4 py-2">
                            {editingRowIndex === index ? (
                              <select
                                value={user.role.role_name}
                                onChange={(e) => handleRoleChange(e.target.value, index)}
                                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                              >
                                {roles.map((role) => (
                                  <option key={role.role_id} value={role.role_name}>{role.role_name}</option>
                                ))}
                              </select>
                            ) : (
                              user.role.role_name
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingRowIndex === index ? (
                              <button
                                onClick={() => handleStopEditRole(user.user_id, user.role.role_name)}
                                className="mr-2 text-red-600 hover:text-red-900 focus:outline-none"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditRole(index)}
                                className="mr-2 text-green-600 hover:text-green-900 focus:outline-none"
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
                            )}
                            <button
                              onClick={() => handleDeleteAccount(user)}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            )}
            {index === 2 && (
              <div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12">
                  <div className="flex justify-end mb-4">
                    <select
                      className="text-center block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      defaultValue={"default"}
                      value={editedYear}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setEditedYear(selectedValue);
                        handleYearChange(selectedValue);
                      }}
                    >
                      <option value="2024">All Year</option>
                      {academicYearsAR.map((year) => (
                        <option key={year.academic_year_id} value={year.academic_year}>
                          {year.academic_year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-semibold text-center mb-6">Statistic Based On Number Of Contributions Within Faculty In Year {editedYear == 'default' ? editedYear : '2024'}</h1>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="chart-container">
                        <div className="flex justify-center">
                          <div className="w-[800px] max-w-xl mx-auto">
                            <canvas id="myChartCounts"></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="chart-container">
                        <h1 className="text-2xl font-semibold text-center mb-6">Statistic Based On Percentage Of Contributions Within Faculty In Year {editedYear == 'default' ? editedYear : '2024'}</h1>
                        <div className="max-w-sm mx-auto">
                          <canvas id="myChartPercentages"></canvas>
                        </div>
                      </div>
                      <div className="chart-container">
                        <h1 className="text-2xl font-semibold text-center mb-6">Statistic Based On Number Of Contributors Within Faculty In Year {editedYear == 'default' ? editedYear : '2024'}</h1>
                        <div className="max-w-sm mx-auto">
                          <canvas id="myChartContributors"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {index === 3 && (
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

export default Administrator;
