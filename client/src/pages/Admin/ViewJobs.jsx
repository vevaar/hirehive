// ViewJobs.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../api/axios';
import Tabs from '../../components/Tabs';
import StatsGrid from '../../components/StatsGrid';
import Modal from '../../components/Modal';
import InputPopUpModal from '../../components/InputPopUpModal';
import { formatDescription } from '../../utility/formatDescription';
import SideCard from '../../components/SideCard';
import Table from '../../components/Table';
import one from '../../svg/StatsCard/Jobs Page/one';
import Header from '../../components/utility/Header';
import { ACTION_TYPES } from '../../utility/ActionTypes';
import { ApplicationIcon, ApplicationIconActive } from '../../svg/Tabs/ApplicationIcon';
import { CandidateDetailsIcon, CandidateDetailsIconActive } from '../../svg/Tabs/CandidateDetailsIcon';
import Total from '../../svg/StatsCard/View Candidate/Total';
import Portfolio from '../../svg/StatsCard/View Candidate/Portfolio';
import Screening from '../../svg/StatsCard/View Candidate/Screening';
import DesignTask from '../../svg/StatsCard/View Candidate/DesignTask';
import Round1 from '../../svg/StatsCard/View Candidate/Round1';
import Round2 from '../../svg/StatsCard/View Candidate/Round2';
import OfferSent from '../../svg/StatsCard/View Candidate/OfferSent';
import EngRate from '../../svg/StatsCard/View Details/EngRate';
import QuaApp from '../../svg/StatsCard/View Details/Portfolio';
import AppRec from '../../svg/StatsCard/View Details/AppRec';
import Views from '../../svg/StatsCard/View Details/Views';


const ViewJobs = () => {
    const { id: mainId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const [closeReason, setCloseReason] = useState('');

    const [activeTab, setActiveTab] = useState('candidate');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const tabs = [
        {
            name: 'jobDetails', label: 'Job Details', icon: <CandidateDetailsIcon />,
            activeIcon: <CandidateDetailsIconActive />,
        },
        {
            name: 'candidate', label: 'Candidates', icon: <ApplicationIcon />,
            activeIcon: <ApplicationIconActive />,
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValue1, setSelectedValue1] = useState('');
    const [selectedValue2, setSelectedValue2] = useState('');

    const handleConfirm = () => {
        console.log('Confirmed with selections:', selectedValue1, selectedValue2);
        setIsModalOpen(false);
    };

    const handleCloseReasonChange = (reason) => {
        setCloseReason(reason);
    };

    const fields = [
        {
            type: 'select',
            label: 'Start Range',
            value: selectedValue1,
            onChange: (e) => setSelectedValue1(e.target.value),
            options: [
                { value: '1', label: '1 Lpa' },
                { value: '2', label: '2 Lpa' },
                { value: '3', label: '3 Lpa' },
                { value: '4', label: '4 Lpa' },
                { value: '5', label: '5 Lpa' },
            ],
        },
        {
            type: 'select',
            label: 'End Range',
            value: selectedValue2,
            onChange: (e) => setSelectedValue2(e.target.value),
            options: [
                { value: '1', label: '1 Lpa' },
                { value: '2', label: '2 Lpa' },
                { value: '3', label: '3 Lpa' },
                { value: '4', label: '4 Lpa' },
                { value: '5', label: '5 Lpa' },
            ],
        },
    ];


    const confirmAction = (job) => {
        switch (modalAction) {
            case ACTION_TYPES.DELETE:
                deleteMutation.mutate(mainId);
                break;
            case ACTION_TYPES.DRAFT:
                draftMutation.mutate(mainId);
                break;
            case ACTION_TYPES.CLOSE:
                closeMutation.mutate({ jobId: mainId, closeReason });
                break;
            case ACTION_TYPES.EDIT:
                navigate(`/admin/edit-job/${mainId}`);
                setModalOpen(false);
                break;
            default:
                console.log('Unknown action:', modalAction);
        }
    };


    // Fetch job data
    const { data: formData, isLoading: isJobLoading } = useQuery({
        queryKey: ['job', mainId],
        queryFn: () => axios.get(`/jobs/getJobById/${mainId}`).then(res => res.data),
    });

    //fetch all candidate data for the respective job we have
    const { data: candidatesData, isLoading: isCandidatesLoading } = useQuery({
        queryKey: ['candidates', mainId],
        queryFn: () => axios.get(`/admin/candidate/${mainId}`).then(res => res.data),
    });

    console.log( "NOISSEEE" , candidatesData?.candidates)

    const [jobStats , setJobStats] = useState([]);

    //Fetch Stats data for Speicif Job
    // const { data: jobStats, isLoading: isStatsLoading } = useQuery({
    //     queryKey: ['jobStats', mainId],
    //     queryFn: () => axios.get(`/jobs/candidates/${mainId}/stats`).then(res => res.data),
    // });

    console.log("yelelelele", jobStats?.data?.stageStats);

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: (mainId) => axios.delete(`/jobs/deleteJob/${mainId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job'] });
            setModalOpen(false);
            navigate(-1);
        },
    });

    const draftMutation = useMutation({
        mutationFn: (jobId) => axios.put(`/jobs/draftJob/${jobId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setModalOpen(false);
            navigate(-1);
        },
    });

    const closeMutation = useMutation({
        mutationFn: ({ jobId, reason }) => axios.put(`/jobs/closeJob/${jobId}`, { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setModalOpen(false);
            navigate(-1);
        },
    });

    const updateCandidateMutation = useMutation({
        mutationFn: ({ id, updates }) => axios.patch(`/jobs/candidates/update/${id}`, updates),
        onMutate: async ({ id, updates }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries(['candidates', mainId]);

            // Snapshot the previous value
            const previousCandidates = queryClient.getQueryData(['candidates', mainId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['candidates', mainId], old =>
                old.map(candidate =>
                    candidate._id === id ? { ...candidate, ...updates } : candidate
                )
            );

            // Return a context object with the snapshotted value
            return { previousCandidates };
        },
        onError: (err, newCandidates, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(['candidates', mainId], context.previousCandidates);
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries(['candidates', mainId]);
        },
    });


    const handleUpdateCandidate = (id, updates) => {
        updateCandidateMutation.mutate({ id, updates });
    };

    useEffect(() => {
        if (mainId) {
            localStorage.setItem('currentJobId', mainId);
        }
    }, [mainId]);


    if (isJobLoading || isCandidatesLoading) {
        return <div>Loading...</div>;
    }

    const { questions = [] } = formData || {};

    const candidateStats = [
        { title: 'Total', value: jobStats?.data?.totalCount || 0, icon: Total },
        { title: 'Portfolio', value: jobStats?.data?.stageStats?.Portfolio || 0, icon: Portfolio },
        { title: 'Screening', value: jobStats?.data?.stageStats?.Screening || 0, icon: Screening },
        { title: 'Design Task', value: jobStats?.data?.stageStats['Design Task'] || 0, icon: DesignTask },
        { title: 'Round 1', value: jobStats?.data?.stageStats['Round 1'] || 0, icon: Round1 },
        { title: 'Round 2', value: jobStats?.data?.stageStats['Round 2'] || 0, icon: Round2 },
        { title: 'Offer Sent', value: jobStats?.data?.stageStats?.Hired || 0, icon: OfferSent },
    ];

    const jobsDetailStats = [
        { title: 'Views', value: "0", icon: Views },
        { title: 'Applications Received', value: 1, icon: AppRec },
        { title: 'Qualified applications', value: '80', icon: QuaApp },
        { title: 'Engagement Rate', value: '78%', icon: EngRate },
    ];

    const handleAction = (action, jobId) => {
        setModalOpen(true);
        setSelectedJob(jobId);
        setModalAction(action);
    };

    const getModalMessage = (action, job) => {
        switch (action) {
            case ACTION_TYPES.DELETE:
                return `Are you sure you want to delete the "${formData.jobTitle}" job post?`;
            case ACTION_TYPES.EDIT:
                return `Are you sure you want to edit the "${formData.jobTitle}" job post?`;
            case ACTION_TYPES.DRAFT:
                return `Are you sure you want to move "${formData.jobTitle}" to drafts?`;
            case ACTION_TYPES.CLOSE:
                return `Are you sure you want to close the "${formData.jobTitle}" job post?`;
            case ACTION_TYPES.REJECT:
                return `Are you sure you want to reject the candidate for "${formData.jobTitle}"?`;
            case ACTION_TYPES.ARCHIVE:
                return `Are you sure you want to archive the "${formData.jobTitle}" job post?`;
            default:
                return `Are you sure you want to perform this action on "${formData.jobTitle}"?`;
        }
    };


    return (
        <div className="mx-4 pt-4 h-screen">

            <Header HeaderText={formData.jobTitle} withKebab="true" withBack="true" job={formData} handleAction={handleAction}></Header>

            <div className='absolute right-24 top-5'>
                <Tabs tabs={tabs} activeTab={activeTab} handleTabClick={handleTabClick} />
            </div>


            {activeTab === 'jobDetails' && (
                <div className='bg-background-30 p-6 rounded-xl mt-5'>
                    <StatsGrid stats={jobsDetailStats} />
                    <div className='flex justify-between'>
                        <div className='w-2/3'>
                            <h2 className="typography-h4 mt-4 mb-2">Job Description</h2>
                            <div className='text-font-gray font-outfit' dangerouslySetInnerHTML={{ __html: formData.jobDescription ? formatDescription(formData.jobDescription) : '' }}></div>
                            <h2 className="typography-h4 mt-4 mb-5">Skills</h2>
                            <div className='grid grid-cols-6 gap-3 mb-5'>
                                {formData.skills && formData.skills.map((skill, index) => (
                                    <span key={index} className="flex justify-center bg-background-70 m px-6 py-2 rounded-full">{skill}</span>))}
                            </div>
                        </div>
                        <div>
                            <SideCard formData={formData} />
                        </div>
                    </div>

                    <div className='bg-background-90 p-6 rounded-xl'>
                        <h3 className='typography-h3 mb-8'>Additional Questions</h3>
                        {questions.map((question, index) => (
                            <div key={question._id} className="mb-4">
                                <label className="typography-body">
                                    {index + 1}. {question.text}
                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {(
                                    question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="mb-2 typography-body flex justify-start items-center gap-2">
                                            {/* <input
                                                type="radio"
                                                id={`question-${question._id}-option-${optionIndex}`}
                                                name={`question-${question._id}`}
                                                value={option}
                                                onChange={(e) => handleInputChange(question._id, e.target.value)}
                                                required={question.required}
                                                className="mr-2"
                                            /> */}
                                            <div className='w-4 h-4 rounded-full border border-gray-600'></div>
                                            <label htmlFor={`question-${question._id}-option-${optionIndex}`}>{option}</label>
                                        </div>
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'candidate' && (
                <div className='bg-background-30 p-6 rounded-xl mt-5'>
                    <div className="w-full max-w-6xl mb-4">
                        <StatsGrid stats={candidateStats} />
                    </div>
                    <div>
                        <div>
                            <Table
                                rowsData={candidatesData?.candidates}
                                jobId={mainId} // Pass jobId to Table component
                            >
                            </Table>
                            {/* <Table rowsData={candidatesData} extraCTA='true' onUpdateCandidate={handleUpdateCandidate} /> */}
                            {/* <DataTable rowsData={candidatesData} onUpdateCandidate={updateCandidate} onUpdateAssignee={updateAssignee} onUpdateRating={updateRating}/> */}
                        </div>
                    </div>
                </div>
            )}

            <InputPopUpModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                confirmAction={handleConfirm}
                fields={fields}
                heading="Screen with Budget"
                para="Candidates will no longer be able to apply. Are you sure you want to close this job?"
                confirmButtonText="Apply Budget"
                cancelButtonText="Cancel"
            />

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setCloseReason(''); // Reset close reason when modal is closed
                }}
                actionType={modalAction}
                onConfirm={(job) => confirmAction(job, closeReason)}
                item={selectedJob}
                customMessage={selectedJob ? getModalMessage(modalAction, selectedJob) : ''}
                closeReason={closeReason}
                onCloseReasonChange={handleCloseReasonChange}
            />
        </div>
    );
};

export default ViewJobs;
