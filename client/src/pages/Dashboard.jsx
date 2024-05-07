import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Filters from '../components/Filters';
//import useNavigate  from 'react-router-dom';

const Dashboard = () => {
    //const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [filterJobs, setFilterJobs] = useState([]);
    const [jobCount, setJobCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statistics, setStatistics] = useState({});


    const [activeJobsCountFilter, setActiveJobsCountFilter] = useState(0);

    const [activeTab, setActiveTab] = useState('active'); // State to track active tab
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [draftJobs, setDraftJobs] = useState([]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const [filters, setFilters] = useState({
        jobType: [],
        experienceLevel: [],
        category: []
    });

    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleCheckboxChange = (filterType, value) => {
        const updatedFilters = { ...filters };
        const index = updatedFilters[filterType].indexOf(value);

        if (index !== -1) {
            updatedFilters[filterType].splice(index, 1); // Remove filter
        } else {
            updatedFilters[filterType].push(value); // Add filter
        }

        setFilters(updatedFilters);
    };


    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8008/api/jobs');
            setJobs(response.data);
            console.log(response)
            // setJobs(response.data); // Assuming response.data is an array of job objects
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchJobCount = async () => {
        try {
            const response = await axios.get('http://localhost:8008/api/jobsCount');
            const data = response.data.totalCount;
            console.log(data)
            setJobCount(data);
            console.log(jobCount)

        } catch (error) {
            console.log(error)
        }
    };

    const fetchFilterJobs = async () => {
        try {
            const response = await axios.post('http://localhost:8008/api/filterJobs', { filters });
            console.log("yeh kya hai buhaiji", response.data)
            console.log(filters)
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching filtered jobs:', error);
        }
    };
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:8008/api/jobsStats');
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching job statistics:', error);
        }
        console.log("hers the data" + statistics)
    };

    const fetchActiveJobsStats = async () => {
        try {
            const response = await axios.get('http://localhost:8008/api/activeJobsFilterCount');
            setActiveJobsCountFilter(response.data);
        } catch (error) {
            console.error('Error fetching job statistics:', error);
        }
        console.log("hers the data" + statistics)
    };

    useEffect(() => {
        fetchFilterJobs();
    }, [filters]); // Trigger fetchJobs whenever filters change  

    useEffect(() => {
        fetchJobs();
        fetchJobCount();
        fetchStatistics();
        fetchActiveJobsStats();
    }, []); // Run once on component mount

    useEffect(() => {
        const searchJobs = async () => {
            try {
                const response = await axios.get(`http://localhost:8008/api/searchJobs?title=${encodeURIComponent(searchQuery)}`);
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        // Trigger fetchJobs when searchQuery changes
        if (searchQuery !== '') {
            searchJobs();
        } else {
            // If searchQuery is empty, fetch all jobs again
            fetchJobs();
        }
    }, [searchQuery]);

    useEffect(() => {
        // Filter jobs based on status
        const activeJobsFiltered = jobs.filter(job => job.status === 'active');
        const draftJobsFiltered = jobs.filter(job => job.status === 'draft');
        const archivedJobsFiltered = jobs.filter(job => job.status === 'archived');
        setActiveJobs(activeJobsFiltered);
        setDraftJobs(draftJobsFiltered);
        setArchivedJobs(archivedJobsFiltered);
    }, [jobs]); // Trigger filtering when jobs data changes

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const reveredJobArray = jobs.reverse();

    return (
        <div className="mx-24 pt-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Jobs</h1>
                <Link to="/create-job" className="bg-black text-white px-4 py-2 rounded">Create job listing</Link>
                {/* <button className="bg-black text-white px-4 py-2 rounded">Create job listing</button> */}
            </div>
            <div className='flex gap-3'>

                <div className="flex justify-between mb-4">
                    <div className='bg-gray-100 flex flex-col p-2 rounded-md'>

                        <div className="text-gray-600" >Total Jobs:</div>
                        <h1 className='text-2xl'>{jobCount}</h1>
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className='bg-gray-100 flex flex-col p-2 rounded-md'>

                        <div className="text-gray-600" >Application Received:</div>
                        <h1 className='text-2xl'>0</h1>
                    </div>
                </div>
            </div>


            <div className='flex justify-between'>
                <div className='flex gap-2'>
                <span className={activeTab === 'active' ? 'underline cursor-pointer' : 'cursor-pointer'} onClick={() => handleTabClick('active')}>Active Jobs ({statistics?.totalActiveJobs})</span>
                    <span className={activeTab === 'draft' ? 'underline cursor-pointer' : 'cursor-pointer'} onClick={() => handleTabClick('draft')}>Draft Jobs ({statistics?.totalDraftJobs})</span>
                    <span className={activeTab === 'archived' ? 'underline cursor-pointer' : 'cursor-pointer'} onClick={() => handleTabClick('archived')}>Archived Jobs ({statistics?.totalArchivedJobs})</span>
                </div>
                <div className="mb-4 w-[360px]">
                    <input
                        className="border border-gray-300 px-4 py-2 w-full rounded"
                        placeholder="Job title or keyword"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className='flex'>
                <Filters filters={filters} statistics={activeJobsCountFilter} handleCheckboxChange={handleCheckboxChange} />
                <div className='w-full ml-4'>
                    
                    {
                        searchQuery.length != 0 && filterJobs && jobs.map((job) => {
                            <div key={job._id} className="bg-white shadow rounded p-4 mb-4 w-[100%]">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-bold">{job.title}</h2>
                                    <div className="text-sm text-gray-500">posted 1 day ago</div>
                                </div>
                                <div className="flex mb-2">
                                    {/* {
                                        job.category.map((category) => (
                                            <span key={category} className="bg-gray-200 text-gray-600 px-2 py-1 mr-2 rounded">{category}</span>
                                        ))
                                    } */}
                                </div>
                                <div className='flex'>

                                    <p className="text-gray-700 mb-4">{job.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">
                                        <span className="font-bold">{job.applicationsCount}</span> applied
                                    </div>
                                    <Link to={`/job/${job._id}`} className="bg-black text-white px-4 py-2 rounded">Know More</Link>
                                </div>
                            </div>
                        })
                    }



                    {/* Display jobs based on active tab */}
                    {activeTab === 'active' &&
                        activeJobs.map((job) => (
                            <div key={job._id} className="bg-white shadow rounded p-4 mb-4 w-[100%]">
                                <h2 className="text-lg font-bold">{job.title}</h2>
                                <p className="text-gray-700 mb-4">{job.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">
                                        <span className="font-bold">{job.applicationsCount}</span> applied
                                    </div>
                                    <Link to={`/job/${job._id}`} className="bg-black text-white px-4 py-2 rounded">Know More</Link>
                                </div>
                            </div>
                        ))}
                    {activeTab === 'draft' &&
                        draftJobs.map((job) => (
                            <div key={job._id} className="bg-white shadow rounded p-4 mb-4 w-[100%]">
                                <h2 className="text-lg font-bold">{job.title}</h2>
                                <p className="text-gray-700 mb-4">{job.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">
                                        <span className="font-bold">{job.applicationsCount}</span> applied
                                    </div>
                                    <Link to={`/job/${job._id}`} className="bg-black text-white px-4 py-2 rounded">Know More</Link>
                                </div>
                            </div>
                        ))}
                    {activeTab === 'archived' &&
                        archivedJobs.map((job) => (
                            <div key={job._id} className="bg-white shadow rounded p-4 mb-4 w-[100%]">
                                <h2 className="text-lg font-bold">{job.title}</h2>
                                <p className="text-gray-700 mb-4">{job.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">
                                        <span className="font-bold">{job.applicationsCount}</span> applied
                                    </div>
                                    <Link to={`/job/${job._id}`} className="bg-black text-white px-4 py-2 rounded">Know More</Link>
                                </div>
                            </div>
                        ))}

                </div>

            </div>

        </div>


    );
};

export default Dashboard;
