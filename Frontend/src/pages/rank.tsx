/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { urlBackend } from "../global";
import { useRouter } from 'next/router';

interface RankData {
  playername: string;
  hospital: string;
  faculty: string;
  score: string;
  time: string;
}

const Rank = () => {
  const [rank, setRank] = useState<RankData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRank = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${urlBackend}/results/rank`);
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

  const playAgain = async () => {
    try {
      await router.push('/register');
    } catch (error) {
      console.error('Error redirecting:', error);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bảng Xếp Hạng</h1>
      {loading &&
        <article className="fixed inset-0 z-30 flex flex-col bg-ln-custom p-7 transition duration-300">
          <img
            className="hidden sm:block absolute inset-0 mx-auto 
            md:w-11/12 md:h-4/5 md:mt-14 
            lg:w-9/12 lg:h-5/6 lg:mt-10 
            xl:w-8/12 xl:h-5/6 xl:mt-10 
            2xl:w-2/5 2xl:h-5/6 2xl:mt-6"
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
      }
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <article className="fixed inset-0 z-30 flex flex-col bg-ln-custom p-7 transition duration-300">
          <img
            className="hidden sm:block absolute inset-0 mx-auto 
        md:w-11/12 md:h-4/5 md:mt-14 
        lg:w-[60%] lg:h-[84%] lg:mt-10 
        xl:w-8/12 xl:h-5/6 xl:mt-10 
        2xl:w-2/5 2xl:h-5/6 2xl:mt-6"
            src="/doctor.png"
            alt="Background"
          />
          <div className="flex-grow flex items-center justify-center relative z-10">
            <div className="w-full sm:w-9/12 md:w-full lg:w-4/6 flex flex-col gap-2 md:gap-5 bg-white rounded-2xl p-2 md:p-5 md:pt-2 pb-10 md:mt-[176px] overflow-x-auto">
              <div className="flex justify-center">
                <h1 className="text-2xl md:text-4xl font-bold my-4 t-bold tc-blue">Bảng Xếp Hạng</h1>
              </div>
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg_btn t-bold md:text-base text-[10px] text-white">
                    <th className="px-2 py-1 md:px-4 md:py-2 rounded-tl-full rounded-bl-full">Xếp hạng</th>
                    <th className="px-2 py-1 md:px-4 md:py-2">Tên người chơi</th>
                    <th className="px-2 py-1 md:px-4 md:py-2">Bệnh viện</th>
                    <th className="px-2 py-1 md:px-4 md:py-2">Chuyên khoa</th>
                    <th className="px-2 py-1 md:px-4 md:py-2">Số điểm</th>
                    <th className="px-2 py-1 md:px-4 md:py-2 rounded-tr-full rounded-br-full">Thời gian hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {rank.map((player, index) => (
                    <tr key={index} className="border-b t-reg md:text-base text-[10px]">
                      <td className="px-2 py-1 md:px-4 md:py-2">
                        {index + 1 === 1 && (
                          <img src='/1st.png' className='w-[44px] h-[55px]' alt='First Place'></img>
                        )}
                        {index + 1 === 2 && (
                          <img src='/2nd.png' className='w-[44px] h-[55px]' alt='Second Place'></img>
                        )}
                        {index + 1 === 3 && (
                          <img src='/3rd.png' className='w-[44px] h-[55px]' alt='Third Place'></img>
                        )}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-center">{player.playername}</td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-center">{player.hospital}</td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-center">{player.faculty}</td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-center">{player.score}</td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-center">{player.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => void playAgain()}
                  className="px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded-md t-bold"
                >
                  Chơi Lại
                </button>
              </div>
            </div>
          </div>
        </article>
      )};
    </div>
  );
};

export default Rank;
