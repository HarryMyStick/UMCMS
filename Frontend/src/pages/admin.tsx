/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { urlBackend } from "../global";
import ExcelJS from 'exceljs';

interface RankData {
    playername: string;
    hospital: string;
    faculty: string;
    score: string;
    time: string;
}

const Admin = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [rank, setRank] = useState<RankData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorMessage('');
        }, 3000);
        return () => clearTimeout(timeout);
    }, [errorMessage]);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (username === "admin" && password === "admin") {
            setLoggedIn(true);
        } else {
            setErrorMessage("Sai tài khoản hoặc mật khẩu");
        }
    };

    const fetchRank = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${urlBackend}/results/data`);
            if (!response.ok) {
                throw new Error('Failed to fetch rankings');
            }
            const data = await response.json() as RankData[];

            const formattedRank = data.map((item) => ({
                playername: item.playername,
                hospital: item.hospital,
                faculty: item.faculty,
                score: item.score,
                time: item.time,
            }));

            setRank(formattedRank);
            setError(null);
        } catch (error) {
            console.error('Error fetching rankings:', error);
            setError('Failed to fetch rankings. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleDownloadExcel = async () => {
        const newWorkbook = new ExcelJS.Workbook();
        const newWorksheet = newWorkbook.addWorksheet('Scores');
        const newColumns = [
            { header: 'Tên người chơi', key: 'playername' },
            { header: 'Bệnh viện', key: 'hospital' },
            { header: 'Khoa', key: 'faculty' },
            { header: 'Số điểm', key: 'score' },
            { header: 'Thời gian hoàn thành', key: 'time' },
        ];
        newWorksheet.columns = newColumns;

        try {
            setLoading(true);
            await fetchRank(); // Fetch the data before creating the Excel file

            rank.forEach((row) => {
                newWorksheet.addRow(row);
            });

            newWorksheet.columns.forEach((column) => {
                column.alignment = { horizontal: 'center' };
            });

            newWorkbook.xlsx.writeBuffer()
                .then((buffer) => {
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'data.xlsx';
                    a.click();

                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.error('Error download:', error);
                });
        } catch (error) {
            console.error('Error generating Excel file:', error);
            setError('Failed to generate Excel file.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchRank();
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again.');
                setLoading(false);
            }
        };
        void fetchData();
    }, []);

    return (

        <div className="max-w-screen-md mx-auto p-4">
            {loggedIn ? (
                // Render data table when logged in
                <>
                    {loading ? (
                        // Show loading state
                        <article className="fixed inset-0 z-30 flex flex-col bg-ln-custom p-7 transition duration-300">
                            <img
                                className="hidden sm:block absolute inset-0 mx-auto md:w-11/12 md:h-4/5 md:mt-14 lg:w-9/12 lg:h-5/6 lg:mt-10 xl:w-8/12 xl:h-5/6 xl:mt-10 2xl:w-2/5 2xl:h-5/6 2xl:mt-6"
                                src="/doctor.png"
                                alt="Background"
                            />
                            <div className="flex-grow flex items-center justify-center relative z-10">
                                <div className="w-full sm:w-9/12 md:w-full lg:w-4/6 flex flex-col gap-2 md:gap-5 bg-white rounded-2xl p-2 md:p-5 md:pt-2 pb-10 md:mt-[176px] overflow-x-auto">
                                    <div className="flex justify-center">
                                        <h1 className="text-2xl md:text-4xl font-bold my-4 t-bold tc-blue">Bảng Xếp Hạng</h1>
                                    </div>
                                    <div className="flex items-center justify-center h-full">
                                        <h1>Loading...</h1>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ) : error ? (
                        // Show error state
                        <p className="text-red-600">{error}</p>
                    ) : (
                        <article className="fixed inset-0 z-30 flex flex-col bg-ln-custom p-7 transition duration-300">
                            <img
                                className="hidden sm:block absolute inset-0 mx-auto md:w-11/12 md:h-4/5 md:mt-14 lg:w-[60%] lg:h-[84%] lg:mt-10 xl:w-8/12 xl:h-5/6 xl:mt-10 2xl:w-2/5 2xl:h-5/6 2xl:mt-6"
                                src="/doctor.png"
                                alt="Background"
                            />
                            <div className="flex-grow flex items-center justify-center relative z-10">
                                <div className="w-full sm:w-9/12 md:w-full lg:w-4/6 flex flex-col gap-2 md:gap-5 bg-white rounded-2xl p-2 md:p-5 md:pt-2 pb-10 md:mt-[176px] overflow-x-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <h1 className="text-2xl md:text-4xl font-bold my-4 t-bold tc-blue">Bảng Xếp Hạng</h1>
                                        <div>
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-5"
                                                onClick={() => {
                                                    void handleDownloadExcel();
                                                }}>
                                                Xuất file excel
                                            </button>
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => {
                                                    void fetchRank();
                                                }}
                                            >
                                                Cập nhật dữ liệu
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto max-h-[400px]">
                                        <table className="table-auto w-full">
                                            <thead className="sticky top-0 bg-white">
                                                <tr className="bg_btn t-bold xl:text-base text-[12px] text-white">
                                                    <th className="px-2 py-1 xl:px-4 xl:py-2 rounded-tl-full rounded-bl-full">Xếp hạng</th>
                                                    <th className="px-2 py-1 xl:px-4 xl:py-2">Tên người chơi</th>
                                                    <th className="px-2 py-1 xl:px-4 xl:py-2">Bệnh viện</th>
                                                    <th className="px-2 py-1 xl:px-4 xl:py-2">Chuyên khoa</th>
                                                    <th className="px-2 py-1 xl:px-4 xl:py-2">Số điểm</th>
                                                    <th className="px-2 py-1 xl:px-4 xl:py-2 rounded-tr-full rounded-br-full">Thời gian hoàn thành</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rank.map((player, index) => (
                                                    <tr key={index} className="border-b t-reg xl:text-base text-[12px]">
                                                        <td className="px-2 py-1 xl:px-4 xl:py-2">{index + 1}</td>
                                                        <td className="px-2 py-1 xl:px-4 xl:py-2 text-center">{player.playername}</td>
                                                        <td className="px-2 py-1 xl:px-4 xl:py-2 text-center">{player.hospital}</td>
                                                        <td className="px-2 py-1 xl:px-4 xl:py-2 text-center">{player.faculty}</td>
                                                        <td className="px-2 py-1 xl:px-4 xl:py-2 text-center">{player.score}</td>
                                                        <td className="px-2 py-1 xl:px-4 xl:py-2 text-center">{player.time}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}
                </>
            ) : (
                <article className="fixed inset-0 z-30 flex flex-col bg-ln-custom p-7 transition duration-300">
                    <img
                        className="hidden sm:block absolute inset-0 mx-auto md:w-11/12 md:h-4/5 md:mt-14 lg:w-7/12 lg:h-5/6 lg:mt-10 xl:w-8/12 xl:h-5/6 xl:mt-10 2xl:w-2/5 2xl:h-5/6 2xl:mt-6"
                        src="/doctor.png"
                        alt="Background"
                    />
                    <div className="flex-grow flex items-center justify-center relative z-10">
                        <div className="w-full sm:w-9/12 md:w-full lg:w-5/12 flex flex-col gap-6 bg-white rounded-2xl p-6 md:p-8 md:pt-4 pb-10 md:mt-[176px] overflow-x-auto">
                            <h1 className="text-2xl md:text-4xl font-bold my-4 t-bold tc-blue text-center">Đăng nhập</h1>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <input
                                    className="border-2 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                                <input
                                    className="border-2 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {errorMessage && (
                                    <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-yellow-900 text-sm">
                                        {errorMessage}
                                    </div>
                                )}
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                                    type="submit"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </article>
            )}
        </div>
    );
};

export default Admin;
