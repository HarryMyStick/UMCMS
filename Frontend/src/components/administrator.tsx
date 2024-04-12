import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Chart from 'chart.js/auto';
import { MD5 } from "crypto-js";

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
  closure_date: string;
  final_closure_date: string;
}

interface User {
  u_user_id: string;
  u_username: string;
  u_password: string;
  r_role_name: string;
  f_faculty_name: string;
  p_email: string;
  p_profile_id: string;
}

interface Role {
  role_id: string;
  role_name: string;
}

interface Faculty {
  faculty_id: string;
  faculty_name: string;
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
  const [academicYearsAR, setAcademicYearsAR] = useState<AcademicYear[]>([]);
  const [editedYear, setEditedYear] = useState("");

  const [createYearMode, setCreateYearMode] = useState(false);

  const [userList, setUserList] = useState<User[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingYearIndex, setEditingYearIndex] = useState<number | null>(null);
  const [editingFacIndex, setEditingFacIndex] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [createClicked, setCreateClicked] = useState(false);
  const [createFacClicked, setCreateFacClicked] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFaculty, setNewFaculty] = useState("");
  const [newFacultyName, setNewFacultyName] = useState("");
  const [newRole, setNewRole] = useState("");

  const generateYears = (): string[] => {
    const years50: string[] = [];
    for (let year = 2000; year <= 2050; year++) {
      years50.push(year.toString());
    }
    return years50;
  };
  const [yearRange, setYearRange] = useState<string>('');

  const years50: string[] = generateYears();

  // Function to handle changes in the selected year
  const handleYearSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearRange(e.target.value);
  };

  const tabs = ["Manage Closure Date", "Manage Accounts", "Manage Faculty", "Statistical Analysis", "Profile", "Help"];
  const [activeTab, setActiveTab] = useState(() => {
    const storedTabIndex = sessionStorage.getItem("activeTabIndex");
    const tabsLength = tabs.length;
    return storedTabIndex && parseInt(storedTabIndex) < tabsLength ? parseInt(storedTabIndex) : 0;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      displayMessage("", "");
    }, 3000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    fetchProfileData();
    getAllUser();
    getAllRole();
    getAllFaculty();
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

  const handleCreateYear = () => {
    setCreateYearMode(true);
  };

  const handleCancelCreateYear = () => {
    setCreateYearMode(false);
  }

  const handleStopCreateYear = async (academic_year: string) => {
    try {
      const response = await fetch(`${urlBackend}/academicyear/createAcedemicYear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year: academic_year,
        })
      });
      if (response.ok) {
        setCreateYearMode(false);
        getAllAcademicYear();
      } else if (response.status === 409) {
        setNotification({ type: "error", message: "This year already exists." });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    router.push("/login");
  };

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  const handleCreate = () => {
    setCreateClicked(true);
  };

  const handleCreateFac = () => {
    setCreateFacClicked(true);
  };

  const handleCancelFac = () => {
    setCreateFacClicked(false);
  };

  const handleCancel = () => {
    setCreateClicked(false);
  };

  const handleCancelEditFac = () => {
    setEditingFacIndex(null);
  };

  const handleEditFac = (index: number) => {
    setEditingFacIndex(index);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleEditRole = (index: number) => {
    setEditingRowIndex(index);
  };

  const handleCancelEditRole = () => {
    setEditingRowIndex(null);
  };

  const handleEditYear = (index: number) => {
    setEditingYearIndex(index);
  };

  const handleStopEditRole = (user_id: string, password: string, facultyName: string, roleName: string, gmail: string, profile_id: string) => {
    const emailPattern = /.+@[^@]+\..+/;

    if (!emailPattern.test(gmail)) {
      setNotification({ type: "error", message: "Invalid email format. Please enter a valid email address." });
    } else {
      setEditingRowIndex(null);
      const hashPassword = MD5(password).toString();
      updateAccountRole(user_id, hashPassword, facultyName, roleName, gmail, profile_id);
    }
  };

  const handleStopEditFac = async (fac: Faculty) => {
    try {
      const response = await fetch(`${urlBackend}/faculty/updateFaculty/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty_id: fac.faculty_id,
          faculty_name: fac.faculty_name
        })
      });
      if (response.ok) {
        setEditingFacIndex(null);
        getAllFaculty();
      } else if (response.status === 409) {
        setNotification({ type: "error", message: "This faculty name already exists." });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleClosureDateChange = (closureDate: string, index: number) => {
    setAcademicYearsAR(prevAcademicYearsAR => {
      const updatedAcademicYearAr = [...prevAcademicYearsAR];
      const closureDateToUpdate = updatedAcademicYearAr[index];
      if (closureDateToUpdate) {
        updatedAcademicYearAr[index] = {
          ...closureDateToUpdate,
          closure_date: closureDate,
        };
      }
      return updatedAcademicYearAr;
    });
  };

  const handleFinalClosureDateChange = (finalClosureDate: string, index: number) => {
    setAcademicYearsAR(prevAcademicYearsAR => {
      const updatedAcademicYearAr = [...prevAcademicYearsAR];
      const finalClosureDateToUpdate = updatedAcademicYearAr[index];
      if (finalClosureDateToUpdate) {
        updatedAcademicYearAr[index] = {
          ...finalClosureDateToUpdate,
          final_closure_date: finalClosureDate,
        };
      }
      return updatedAcademicYearAr;
    });
  };

  const handleRoleChange = (roleName: string, index: number) => {
    setUserList(prevUserList => {
      const updatedUserList = [...prevUserList];
      const userToUpdate = updatedUserList[index];
      if (userToUpdate) {
        updatedUserList[index] = {
          ...userToUpdate,
          r_role_name: roleName,
        };
      }
      return updatedUserList;
    });
  };

  const handleFacultyChange = (facultyName: string, index: number) => {
    setUserList(prevUserList => {
      const updatedUserList = [...prevUserList];
      const userToUpdate = updatedUserList[index];
      if (userToUpdate) {
        updatedUserList[index] = {
          ...userToUpdate,
          f_faculty_name: facultyName,
        };
      }
      return updatedUserList;
    });
  };

  const handleFacChange = (facultyName: string, index: number) => {
    setFaculties(prevFaculties => {
      const updatedFaculties = [...prevFaculties];
      const facToUpdate = updatedFaculties[index];
      if (facToUpdate) {
        updatedFaculties[index] = {
          ...facToUpdate,
          faculty_name: facultyName,
        };
      }
      return updatedFaculties;
    });
  };

  const handlePasswordChange = (password: string, index: number) => {
    if (password !== "" || password !== null) {
      setUserList(prevUserList => {
        const updatedUserList = [...prevUserList];
        const userToUpdate = updatedUserList[index];
        if (userToUpdate) {
          updatedUserList[index] = {
            ...userToUpdate,
            u_password: password,
          };
        }
        return updatedUserList;
      });
    };
  };

  const handleEmailChange = (email: string, index: number) => {
    setUserList(prevUserList => {
      const updatedUserList = [...prevUserList];
      const userToUpdate = updatedUserList[index];
      if (userToUpdate) {
        updatedUserList[index] = {
          ...userToUpdate,
          p_email: email,
        };
      }
      return updatedUserList;
    });
  };

  const handleSubmit = async () => {
    try {
      const emailPattern = /.+@[^@]+\..+/;

      if (!emailPattern.test(newEmail)) {
        setNotification({ type: "error", message: "Invalid email format. Please enter a valid email address." });
      } else {
        const hashPassword = MD5(newPassword).toString();
        if (!newUsername || !newPassword || !newEmail) {
          setNotification({ type: "error", message: "Please enter enough information." });
        } else {
          const response = await fetch(`${urlBackend}/users/adminRegister/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: newUsername,
              password: hashPassword,
              email: newEmail,
              faculty_id: newFaculty,
              role_id: newRole,
            })
          });
          if (response.ok) {
            setCreateClicked(false);
            getAllUser();
          } else {
            console.log("Cancelled.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handleSubmitFac = async () => {
    try {
      if (!newFacultyName) {
        setNotification({ type: "error", message: "Please enter enough information." });
      } else {
        const response = await fetch(`${urlBackend}/faculty/createFaculty/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faculty_name: newFacultyName,
          })
        });
        if (response.ok) {
          setCreateFacClicked(false);
          getAllFaculty();
        } else {
          console.log("Cancelled.");
        }
      }
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  }
  const handleDeleteFac = async (fac: Faculty) => {
    // Display an alert to confirm deletion
    if (window.confirm(`Are you sure you want to delete the account for ${fac.faculty_name}?`)) {
      try {
        const response = await fetch(`${urlBackend}/faculty/deleteFaculty/${fac.faculty_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setEditingFacIndex(null);
          getAllFaculty();
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
      console.log(`Deleting faculty ${fac.faculty_name}...`);
    } else {
      console.log("Deletion cancelled.");
    }
  }

  const handleDeleteAccount = async (user: User) => {
    // Display an alert to confirm deletion
    if (window.confirm(`Are you sure you want to delete the account for ${user.u_username}?`)) {
      try {
        const response = await fetch(`${urlBackend}/users/deleteUser/${user.u_user_id}`, {
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
      console.log(`Deleting account for ${user.u_username}...`);
    } else {
      console.log("Deletion cancelled.");
    }
  }

  const handleDeleteAcademicYear = async (year: AcademicYear) => {
    // Display an alert to confirm deletion
    if (window.confirm(`Are you sure you want to delete academic year ${year.academic_year}?`)) {
      try {
        const response = await fetch(`${urlBackend}/academicyear/deleteYear/${year.academic_year_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          getAllAcademicYear();
        }
      } catch (error) {
        console.error("Error fetching academic year data:", error);
      }
      console.log(`Deleting academic year ${year.academic_year}...`);
    } else {
      console.log("Deletion cancelled.");
    }
  }
  const formatDate = (dateString: string) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 hours should be displayed as 12, not 0
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${dayOfWeek} ${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
  };


  const formatStringToDateTimeLocal = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  const updateAccountRole = async (user_id: string, password: string, faculty_name: string, role_name: string, gmail: string, profile_id: string) => {
    try {
      const response = await fetch(`${urlBackend}/users/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          password: password,
          faculty_name: faculty_name,
          role_name: role_name,
          email: gmail,
          profile_id: profile_id
        })
      });
      if (response.ok) {
        setNotification({ type: "success", message: "Update account successfully." });
        setEditingRowIndex(null);
        console.log(user_id);
        console.log(role_name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setNotification({ type: "error", message: "Update account unsuccessfully due to some error!!" });
    }
  }

  const fetchDataChart = async (year: string) => {
    try {
      // FETCH CONTRIBUTION STATISTICS
      const contributionResponse = await fetch(`${urlBackend}/contribution/statisticContributionPerYear/${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!contributionResponse.ok) {
        throw new Error('Failed to fetch contribution statistics');
      }

      // FETCH CONTRIBUTORS STATISTIC
      const contributorResponse = await fetch(`${urlBackend}/contribution/statisticContributorsPerYear/${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!contributorResponse.ok) {
        throw new Error('Failed to fetch contributor statistics');
      }

      // DECLARE DATA

      const contributionData = await contributionResponse.json();
      const contributorData = await contributorResponse.json();
      const containerChart = document.getElementById('container-chart');
      if (containerChart) {
        if (contributionData.length === 0) {
          containerChart.innerHTML = `
                    <div id="no-data" class="flex items-center justify-center h-full">
                        <h1 class="text-2xl font-semibold">There is no contributions be contribute this year!!</h1>
                    </div>
                `;
        } else {
          const containerChartHTML = `
            <div id="container-chart">
                <div class="container mx-auto px-4 py-8">
                    <h1 class="text-2xl font-semibold text-center mb-6">Statistic Based On Number Of Contributions Within Faculty In Year ${editedYear == 'default' ? editedYear : '2024'}</h1>
                    <div class="grid grid-cols-1 gap-8">
                        <div class="chart-container">
                            <div class="flex justify-center">
                                <div class="w-[800px] max-w-xl mx-auto">
                                    <canvas id="myChartCounts"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div class="chart-container">
                            <h1 class="text-2xl font-semibold text-center mb-6">Statistic Based On Percentage Of Contributions Within Faculty In Year ${editedYear == 'default' ? editedYear : '2024'}</h1>
                            <div class="max-w-sm mx-auto">
                                <canvas id="myChartPercentages"></canvas>
                            </div>
                        </div>
                        <div class="chart-container">
                            <h1 class="text-2xl font-semibold text-center mb-6">Statistic Based On Number Of Contributors Within Faculty In Year ${editedYear == 'default' ? editedYear : '2024'}</h1>
                            <div class="max-w-sm mx-auto">
                                <canvas id="myChartContributors"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
          containerChart.innerHTML = containerChartHTML;

          // RENDER COUNT CONTRIBUTION CHART

          const countsContribution = contributionData.map((item: { contributionCount: any; }) => item.contributionCount);
          const labelsContribution = contributionData.map((item: { facultyName: any; academicYear: any; }) => `${item.facultyName} (${item.academicYear})`);
          const canvasContribution = document.getElementById("myChartCounts") as HTMLCanvasElement;
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
                    display: false
                  }
                }
              }
            });
          }

          // RENDER COUNT CONTRIBUTION PERCENTAGE CHART

          const countsContributionPercentage = contributionData.map((item: { contributionCount: string; }) => parseInt(item.contributionCount));
          const totalContributions = countsContributionPercentage.reduce((a: any, b: any) => a + b, 0); // Calculate the total count
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
              },
              options: {
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        var label = context.label || '';
                        if (label) {
                          label += ': ';
                        }
                        const contributionIndex = context.dataIndex;
                        const contributionCount = countsContributionPercentage[contributionIndex];
                        const percentage = ((contributionCount / totalContributions) * 100).toFixed(2);
                        label += percentage + '%';
                        return label;
                      }
                    }
                  }
                }
              }
            });
          }

          // RENDER CONTRIBUTOR CHART

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
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                  ],
                  hoverOffset: 4
                }]
              }
            });
          }
        }
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
        setNewRole(data[0].role_id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const getAllFaculty = async () => {
    try {
      const response = await fetch(`${urlBackend}/faculty/getAllFaculty`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFaculties(data);
        setNewFaculty(data[0].faculty_id);
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

  const handleCancelEditYear = () => {
    setEditingYearIndex(null);
  }

  const handleStopEditYear = async (closure_date: string, final_closure_date: string, year: AcademicYear) => {
    try {
      const closureDate = new Date(closure_date);
      const finalClosureDate = new Date(final_closure_date);
      if (finalClosureDate < closureDate) {
        setNotification({ type: "error", message: "Final closure date must be equal to or greater than the closure date." });
      } else {

        const response = await fetch(`${urlBackend}/academicyear/updateAcadamicYear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academic_year_id: year.academic_year_id,
            closure_date: closureDate,
            final_closure_date: finalClosureDate,
          }),
        });
        if (response.ok) {
          setEditingYearIndex(null);
          getAllAcademicYear();
          setNotification({ type: "success", message: "Dates saved successfully." });
        } else {
          setNotification({ type: "error", message: "Failed to save dates." });
        }
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
            className="ease rounded bg-gray-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 hover:shadow-md focus:outline-none active:bg-gray-600"
            onClick={handleLogout}
          >Sign out
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
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Manage Closure Date &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Manage Closure Date / Final Closure Date<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div className="max-w-screen-xl mx-auto px-4">
                  {notification && (
                    <div
                      className={`p-3 my-2 text-sm rounded-md ${notification.type === "error"
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
                  {createYearMode ? (
                    <div>
                      <div className="flex justify-end mb-4">
                        <label className="p-2 mr-2text-center">Select Year To Create:</label>
                        <select
                          className="mr-2 p-2 border rounded border-gray"
                          value={yearRange}
                          onChange={handleYearSelectChange}
                        >
                          {years50.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <button
                          className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-gray-600"
                          onClick={() => handleStopCreateYear(yearRange || '2000')}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:bg-gray-600"
                          onClick={() => handleCancelCreateYear()}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end mb-4">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                        onClick={handleCreateYear}
                      >
                        Create New Academic Year
                      </button>
                    </div>
                  )}
                  <div className="mt-8">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Academic Year
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Closure Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Final Closure Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {academicYearsAR.map((year, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <div className="text-sm text-gray-900">{year.academic_year}</div>
                            </td>
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <div className="text-sm text-gray-900">
                                {editingYearIndex === index ? (
                                  <div className="relative">
                                    <input
                                      type="datetime-local"
                                      className="w-full bg-gray-100 border rounded p-2 text-center"
                                      value={formatStringToDateTimeLocal(year.closure_date)}
                                      onChange={(e) => handleClosureDateChange(new Date(e.target.value).toISOString(), index)}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <div className="w-full text-center">
                                      {formatDate(year.closure_date)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <div className="text-sm text-gray-900">
                                {editingYearIndex === index ? (
                                  <div className="relative">
                                    <input
                                      type="datetime-local"
                                      className="w-full bg-gray-100 border rounded p-2 text-center"
                                      value={formatStringToDateTimeLocal(year.final_closure_date)}
                                      onChange={(e) => handleFinalClosureDateChange(new Date(e.target.value).toISOString(), index)}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <div className="w-full text-center">
                                      {formatDate(year.final_closure_date)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2 w-1/6 text-center border-b border-gray-300">
                              {editingYearIndex === index ? (
                                <div>
                                  <button
                                    className="text-gray-600 hover:text-gray-900 p-1"
                                    onClick={() => handleStopEditYear(year.closure_date, year.final_closure_date, year)}
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
                                  <button
                                    onClick={handleCancelEditYear}
                                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                </div>
                              ) : (
                                <div className="flex justify-center items-center">
                                  <div>
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-gray-600 hover:text-gray-900 p-1"
                                        onClick={() => handleEditYear(index)}
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
                                      <button
                                        onClick={() => handleDeleteAcademicYear(year)}
                                        className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                    </div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {index === 1 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 mb-2 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Manage Account &gt;
                    </p>
                    <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude text-base">
                      <div className="flex justify-between items-center">
                        <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">Manage User Account Information<span className="bg-darkBlue"></span></h1>
                        <button
                          onClick={getAllUser}
                          className="text-white font-bold py-2 px-4 rounded mx-2 inline-flex items-center relative"
                        >
                          <span className="text-black text-xl pr-2">Refresh</span>
                          <svg
                            className="h-6 w-6 mr-2 transition-transform duration-300 transform hover:rotate-180"
                            viewBox="0 0 489.698 489.698"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <g>
                                <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1
                                        c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8
                                        c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3
                                        c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z"/>
                                <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1
                                        c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8
                                        c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2
                                        c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z"/>
                              </g>
                            </g>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div className="max-w-screen-xl mx-auto px-4">
                  <div className="flex justify-end">
                    {createClicked ? (
                      <div className="inline-flex space-x-2">
                        <input
                          type="text"
                          placeholder="Username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={newFaculty}
                          onChange={(e) => setNewFaculty(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        >
                          {faculties.map((faculty) => (
                            <option key={faculty.faculty_id} value={faculty.faculty_id}>
                              {faculty.faculty_name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-gray-500"
                        >
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleSubmit}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
                        >
                          Submit
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleCreate}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Create New Account
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    {notification && (
                      <div
                        className={`my-2 text-sm rounded-md ${notification.type === "error"
                          ? "bg-red-100 border border-red-300 text-red-900 p-3"
                          : notification.type === "warning"
                            ? "bg-yellow-100 border border-yellow-300 text-yellow-900 p-3"
                            : notification.type === "success"
                              ? "bg-green-100 border border-green-300 text-green-900 p-3"
                              : ""
                          }`}
                      >
                        {notification.message}
                      </div>
                    )}
                    <table className="table-auto w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2">Username</th>
                          <th className="px-4 py-2">Password</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Faculty</th>
                          <th className="px-4 py-2">Role</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userList.map((user, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2 text-center border-b border-gray-300">{user.u_username}</td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingRowIndex === index ? (
                                <input
                                  type="text"
                                  onChange={(e) => handlePasswordChange(e.target.value, index)}
                                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              ) : (
                                <div>***************</div>
                              )}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingRowIndex === index ? (
                                <input
                                  type="email"
                                  value={user.p_email}
                                  onChange={(e) => handleEmailChange(e.target.value, index)}
                                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              ) : (
                                user.p_email
                              )}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingRowIndex === index ? (
                                <select
                                  value={user.f_faculty_name}
                                  onChange={(e) => handleFacultyChange(e.target.value, index)}
                                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                >
                                  {faculties.map((faculty) => (
                                    <option key={faculty.faculty_id} value={faculty.faculty_name}>{faculty.faculty_name}</option>
                                  ))}
                                </select>
                              ) : (
                                user.f_faculty_name
                              )}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingRowIndex === index ? (
                                <select
                                  value={user.r_role_name}
                                  onChange={(e) => handleRoleChange(e.target.value, index)}
                                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                >
                                  {roles.map((role) => (
                                    <option key={role.role_id} value={role.role_name}>{role.role_name}</option>
                                  ))}
                                </select>
                              ) : (
                                user.r_role_name
                              )}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingRowIndex === index ? (
                                <div>
                                  <button
                                    onClick={() => handleStopEditRole(user.u_user_id, user.u_password, user.f_faculty_name, user.r_role_name, user.p_email, user.p_profile_id)}
                                    className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                  <button
                                    onClick={handleCancelEditRole}
                                    className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                              ) : (
                                <div>
                                  <button
                                    onClick={() => handleEditRole(index)}
                                    className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                  <button
                                    onClick={() => handleDeleteAccount(user)}
                                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            )}
            {index === 2 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 mb-2 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Manage Faculty &gt;
                    </p>
                    <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude text-base">
                      <div className="flex justify-between items-center">
                        <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">Manage Faculty Information<span className="bg-darkBlue"></span></h1>
                        <button
                          onClick={getAllFaculty}
                          className="text-white font-bold py-2 px-4 rounded mx-2 inline-flex items-center relative"
                        >
                          <span className="text-black text-xl pr-2">Refresh</span>
                          <svg
                            className="h-6 w-6 mr-2 transition-transform duration-300 transform hover:rotate-180"
                            viewBox="0 0 489.698 489.698"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <g>
                                <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1
                                      c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8
                                      c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3
                                      c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z"/>
                                <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1
                                      c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8
                                      c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2
                                      c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z"/>
                              </g>
                            </g>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div className="max-w-screen-xl mx-auto px-4">
                  <div className="flex justify-end">
                    {createFacClicked ? (
                      <div className="inline-flex space-x-2">
                        <input
                          type="text"
                          placeholder="Faculty Name"
                          value={newFacultyName}
                          onChange={(e) => setNewFacultyName(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={handleSubmitFac}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
                        >
                          Submit
                        </button>
                        <button
                          onClick={handleCancelFac}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleCreateFac}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Create New Faculty
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    {notification && (
                      <div
                        className={`my-2 text-sm rounded-md ${notification.type === "error"
                          ? "bg-red-100 border border-red-300 text-red-900 p-3"
                          : notification.type === "warning"
                            ? "bg-yellow-100 border border-yellow-300 text-yellow-900 p-3"
                            : notification.type === "success"
                              ? "bg-green-100 border border-green-300 text-green-900 p-3"
                              : ""
                          }`}
                      >
                        {notification.message}
                      </div>
                    )}
                    <table className="table-auto w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2">Faculty Name</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faculties.map((fac, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                             <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingFacIndex === index ? (
                                <input
                                  type="text"
                                  value={fac.faculty_name}
                                  onChange={(e) => handleFacChange(e.target.value, index)}
                                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              ) : (
                                fac.faculty_name
                              )}
                            </td>
                            <td className="px-4 py-2 text-center border-b border-gray-300">
                              {editingFacIndex === index ? (
                                <div>
                                  <button
                                    onClick={() => handleStopEditFac(fac)}
                                    className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                  <button
                                    onClick={handleCancelEditFac}
                                    className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                              ) : (
                                <div>
                                  <button
                                    onClick={() => handleEditFac(index)}
                                    className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                  <button
                                    onClick={() => handleDeleteFac(fac)}
                                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            )}
            {index === 3 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Statistical Analysis &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Statistic Chart<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
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
                  <div id="container-chart">
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
              </div>
            )}
            {index === 4 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Profile information &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Your profile information<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
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
                                className="mr-1 rounded bg-gray-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-gray-600"
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
            {index === 5 && (
              <div>
                <div className="container px-6 py-10 mx-auto">
                  <div className="lg:flex lg:items-center">
                    <div className="w-full space-y-12 lg:w-1/2">
                      <div>
                        <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">Welcome to <br /> the University Magazine Contribution Management System (UMCMS™)</h1>
                        <div className="mt-2">
                          <span className="inline-block w-40 h-1 rounded-full bg-blue-500"></span>
                          <span className="inline-block w-3 h-1 ml-1 rounded-full bg-blue-500"></span>
                          <span className="inline-block w-1 h-1 ml-1 rounded-full bg-blue-500"></span>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Submission Management</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            Students can easily submit articles as Word documents and upload high-quality images directly through the system.Submission is subject to agreeing to predefined Terms and Conditions, ensuring compliance and legal clarity.
                          </p>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Role-Based Access Control</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            UMCMS™ accommodates various user roles, including students, faculty marketing coordinators, the University Marketing Manager, guests, and administrators. Each role is assigned specific privileges and responsibilities tailored to their respective functions within the magazine contribution process.
                          </p>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Statistical Analysis</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            UMCMS™ offers robust statistical analysis capabilities, providing insights such as the number of contributions per Faculty, helping stakeholders understand participation levels and trends.
                          </p>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7.257 6.257 8 5.5M17.657 18.657L18 18M18 18l.343.343M18 18a8.001 8.001 0 10-7.657 11.314" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Responsive Interface</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            The system features a responsive and intuitive interface optimized for accessibility across all devices, including mobile phones, tablets, and desktops, ensuring a seamless user experience and convenience.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-12 lg:w-1/2 lg:mt-0 lg:pl-12">
                      <img src="https://ntthnue.edu.vn/uploads/Images/2017/09/013.jpg" alt="Components" className="object-cover w-full h-64 rounded-md shadow-md lg:h-96" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div >
  );
};

export default Administrator;
