import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import ResumeIcon from '../../svg/ResumeIcon';
import PortfolioIcon from '../../svg/PortfolioIcon';
import WebsiteIcon from '../../svg/WebsiteIcon';
import AssignmentIcon from '../../svg/AssignmentIcon';
import BudgetIcon from '../../svg/BudgetIcon';
import PhoneIcon from '../../svg/PhoneIcon';
import EmailIcon from '../../svg/EmailIcon';
import Tabs from '../../components/Tabs';
import MultiRoundStages from '../../components/MultiRoundStages';


const ViewCandidateProfile = () => {
    const [data, setData] = useState([]);

    const [activeTab, setActiveTab] = useState('application');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const tabs = [
        { name: 'application', label: 'Application' },
        { name: 'candidateDetails', label: 'Candidate Details' }
    ];
    const { id: mainId } = useParams();


    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8008/api/v1/candidates/${mainId}`);
            const data = await response.json();
            console.log(data);
            setData(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [mainId]);

    const paths = [
        { name: 'Jobs', href: '/admin/jobs' },
        { name: `${data.jobApplied}`, href: `/admin/view-job/${data.jobId}` },
        { name: `${data.firstName} ${data.lastName}`, href: '' },
    ];

    const handleAutoAssign = () => {
        // Implement the auto-assign logic here
        console.log('Auto assigning portfolio...');
    };

    return (
        <div className="ml-52 pt-4">
            <Breadcrumb paths={paths} />
            <div className='flex justify-between'>
                <div >
                    <h1 className='text-2xl font-bold'> {data.firstName}  {data.lastName}</h1>
                    <p>
                        {data.jobApplied} . {data.location}
                    </p>
                    <div className='flex gap-2'>
                        <ResumeIcon />
                        <PortfolioIcon />
                        <WebsiteIcon />
                        <AssignmentIcon />
                        {
                            data.budget < 100000 && <BudgetIcon />
                        }
                    </div>

                    <div className='flex gap-1 my-4'>
                        <PhoneIcon /> <p>{data.phone}</p>
                    </div>

                    <div className='flex gap-1 my-4'>
                        <EmailIcon /> <p>{data.email}</p>
                    </div>

                    <p>{data.budget}</p>
                    <p>{data.location}</p>
                    <p>{data.experience}</p>
                    <p>{data.skills}</p>
                </div>
                <div className='flex flex-col gap-2 px-2'>
                    <button className="bg-black text-white px-4  py-2 rounded">Move Next Round</button>
                    <button className=" text-black outline px-4 py-2 outline-black rounded">
                        Reject
                    </button>
                </div>
            </div>
            <div className='flex justify-center' >
                <Tabs tabs={tabs} activeTab={activeTab} handleTabClick={handleTabClick} />
            </div>

            {activeTab === 'application' && (
                <div>
                    {/* Application tab content */}
                    <MultiRoundStages
                        currentStage={data.stage}
                        candidateData={data}
                        onAutoAssign={handleAutoAssign}
                    />
                </div>
            )}
            {activeTab === 'candidateDetails' && (
                <div>
                    {/* Candidate Details tab content */}
                </div>
            )}
        </div>

    )
}

export default ViewCandidateProfile

