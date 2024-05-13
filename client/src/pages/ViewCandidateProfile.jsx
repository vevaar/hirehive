import React, { useState } from 'react'

const JobIcon = () => {
    return (

        <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_bi_679_2046)">
                <rect x="1" y="1" width="64" height="64" rx="32" stroke="#E1E2EA" />
                <path d="M35.9333 42C35.9333 42.5891 36.4109 43.0667 37 43.0667C37.5891 43.0667 38.0667 42.5891 38.0667 42H35.9333ZM35 24V22.9333V24ZM31 24V22.9333V24ZM29 26H27.9333H29ZM27.9333 42C27.9333 42.5891 28.4109 43.0667 29 43.0667C29.5891 43.0667 30.0667 42.5891 30.0667 42H27.9333ZM25 29.0667H41V26.9333H25V29.0667ZM41 29.0667C41.5155 29.0667 41.9333 29.4845 41.9333 30H44.0667C44.0667 28.3063 42.6937 26.9333 41 26.9333V29.0667ZM41.9333 30V40H44.0667V30H41.9333ZM41.9333 40C41.9333 40.5155 41.5155 40.9333 41 40.9333V43.0667C42.6937 43.0667 44.0667 41.6937 44.0667 40H41.9333ZM41 40.9333H25V43.0667H41V40.9333ZM25 40.9333C24.4845 40.9333 24.0667 40.5155 24.0667 40H21.9333C21.9333 41.6937 23.3063 43.0667 25 43.0667V40.9333ZM24.0667 40V30H21.9333V40H24.0667ZM24.0667 30C24.0667 29.4845 24.4845 29.0667 25 29.0667V26.9333C23.3063 26.9333 21.9333 28.3063 21.9333 30H24.0667ZM38.0667 42V26H35.9333V42H38.0667ZM38.0667 26C38.0667 25.1867 37.7436 24.4067 37.1685 23.8315L35.66 25.34C35.835 25.5151 35.9333 25.7525 35.9333 26H38.0667ZM37.1685 23.8315C36.5933 23.2564 35.8133 22.9333 35 22.9333L35 25.0667C35.2475 25.0667 35.4849 25.165 35.66 25.34L37.1685 23.8315ZM35 22.9333H31V25.0667H35V22.9333ZM31 22.9333C30.1867 22.9333 29.4067 23.2564 28.8315 23.8315L30.34 25.34C30.5151 25.165 30.7525 25.0667 31 25.0667V22.9333ZM28.8315 23.8315C28.2564 24.4067 27.9333 25.1867 27.9333 26H30.0667C30.0667 25.7525 30.165 25.5151 30.34 25.34L28.8315 23.8315ZM27.9333 26V42H30.0667V26H27.9333Z" fill="#6A6F95" />
            </g>
            <defs>
                <filter id="filter0_bi_679_2046" x="-13.836" y="-13.836" width="93.672" height="93.672" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.168" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_679_2046" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_679_2046" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-2.56" dy="-2.56" />
                    <feGaussianBlur stdDeviation="1.28" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_679_2046" />
                </filter>
            </defs>
        </svg>

    )
}

const ViewCandidateProfile = () => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };
    return (
        <div className='bg-white'>
            <div className="px-24 pt-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div>
                            <h1 className="text-xl font-semibold">Jordyn Press</h1>
                            <p className="text-gray-500">Position</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button className=" text-white px-4 py-2 bg-gray-800 ">Contact</button>
                        <button className="outline px-4 py-2 ">View Portfolio</button>
                    </div>
                </div>

                <div className="flex flex-col items-center ">
                    <div className="flex items-center  mb-4">
                        <div className='flex  justify-between bg-red-600'>
                            <div>


                                <h2 className="text-lg font-bold mr-4">Stage</h2>
                            </div>
                            <div>

                                {!showDetails && (
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={toggleDetails}
                                    >
                                        View detailed
                                    </button>
                                )}
                                {showDetails && (
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={toggleDetails}
                                    >
                                        Edit Stage
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                            <span className="font-bold">Screening</span>
                            {showDetails && (
                                <ul className="list-disc pl-4">
                                    <li>Lorem ipsum dolor sit amet consectetur. Gravida aenean vel rhoncus sed nisl. Leo morbi</li>
                                    <li>vulputate sit sed ac diam tempor vivamus.</li>
                                    <li>Id quam massa ut adipiscing. Mi viverra eget blandit eu</li>
                                    <li>senectus. Sodales tortor vulputate sit dapibus neque facilisis.</li>
                                </ul>
                            )}
                        </div>
                        <div className="flex flex-col items-center mr-4">
                            <span className="font-bold">Challenge</span>
                            {showDetails && (
                                <ul className="list-disc pl-4">
                                    <li>Lorem ipsum dolor sit amet consectetur. Pharetra cursus aliquam feugiat eu. Aliquet</li>
                                    <li>felis elementum ullamcorper donec ut. In euismod</li>
                                    <li>suspendisse cras elementum et. Facilisis diam volutpat nec</li>
                                    <li>pellentesque eu ac cras quis felis. Pretium tempor vitae</li>
                                    <li>tortor tempor aliquet. Ac quis at imperdiet tempus. Facilisi</li>
                                    <li>pretium imperdiet libero ultricies nunc risus.</li>
                                    <li>Libero convallis lobortis egestas tristique ultricies nec</li>
                                    <li>netus. Consectetur convallis sed ultricies mauris consequat</li>
                                    <li>vitae magna elit montes. Sed.</li>
                                </ul>
                            )}
                        </div>
                        <div className="flex flex-col items-center mr-4">
                            <span className="font-bold">Interview 1</span>
                            {showDetails && (
                                <ul className="list-disc pl-4">
                                    <li>Lorem ipsum dolor sit amet consectetur. Pharetra cursus</li>
                                    <li>aliquam feugiat eu. Aliquet felis elementum ullamcorper</li>
                                    <li>donec ut. In euismod suspendisse cras elementum</li>
                                    <li>et.</li>
                                    <li>Libero convallis lobortis egestas tristique ultricies nec</li>
                                    <li>netus. Consectetur convallis sed ultricies mauris consequat</li>
                                    <li>vitae magna elit montes. Sed.</li>
                                </ul>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold">Interview 2</span>
                        </div>
                    </div>
                </div>

                <div>

                    <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray mb-6 mt-6">Basic Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Name</p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">Jordyn Press</h3>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Email ID </p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">jordynpress@gmail.com</h3>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Phone Number </p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">(206) 342-8631</h3>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Candidate ID </p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">JP081H2834</h3>
                            </div>
                        </div>



                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Address </p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">Suite 193 25913 Jayson Driv</h3>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray mb-6 mt-6">Professional Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Current Job Title</p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">UX Designer</h3>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Highest Qualification</p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">Bachelors</h3>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Expected Salary</p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">-</h3>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Current Salary</p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">-</h3>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <JobIcon />
                            <div>
                                <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">Experience in Years</p>
                                <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">4</h3>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default ViewCandidateProfile 

const data = [
    { label: "Current Job Title", value: "UX Designer" },
    { label: "Highest Qualification", value: "Bachelors" },
    { label: "Expected Salary", value: "-" },
    { label: "Current Salary", value: "-" },
    { label: "Experience in Years", value: "4" }
];

function UserProfile({data}) {
    return (
        <div>
            {data.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                    <JobIcon />
                    <div>
                        <p className="font-poppins text-large-p font-large-p leading-large-p text-paragraph-black">{item.label}</p>
                        <h3 className="font-poppins text-h3 font-h3 leading-h3 text-dark-gray">{item.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}