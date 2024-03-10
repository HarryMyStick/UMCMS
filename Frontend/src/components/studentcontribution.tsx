import React, { useEffect, useState } from 'react';
import { urlBackend } from '~/global';
interface NavProps {
    userId: string;
}
const StudentContribution: React.FC<NavProps> = ({ userId }) => {
    const [contributions, setContributions] = useState([]);
    //
    useEffect(() => {
        async function fetchContributions() {
            try {
                //Call API to get faculty_name from userId
                const response1 = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`);
                const { faculty_name } = await response1.json();

                // Call the API to get contributions based on faculty_name
                const response2 = await fetch(`${urlBackend}/contribution/getContributionViaFacultyName/${faculty_name}`);
                const contributionsData = await response2.json();

                setContributions(contributionsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchContributions();
    }, []);

    //
    return (
        <div>
            {contributions.map(contribution => (
                <div key={contribution.contribution_id}
                className="mt-4 relative mx-auto max-w-xs flex flex-col space-y-3 rounded-xl border border-white bg-white p-3 shadow-lg aspect-w-16/9 md:max-w-3xl md:flex-row md:space-x-5 md:space-y-0">
                    <div className="grid w-full place-items-center bg-white md:w-1/3">
                        <img src="https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?a...=1&w=500"
                            alt="tailwind logo" className="rounded-xl" />
                    </div>

                    <div className="flex w-full flex-col space-y-2 bg-white p-3 md:w-2/3">
                        <div className="item-center flex justify-between">
                            <p className="hidden font-medium text-gray-500 md:block">
                                UserName
                            </p>
                        </div>
                        <h3 className="text-xl font-black text-gray-800 md:text-3xl">
                            {contribution.article_title}
                        </h3>
                        <p className="text-base text-gray-500 md:text-lg">
                            {contribution.article_description}
                        </p>
                        <button
                            className="bg_darkBlue mr-1 rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                            type="button">
                            Click to Read
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default StudentContribution;
