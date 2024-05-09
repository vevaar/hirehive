import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditJobs = () => {
    const [formData, setFormData] = useState(null);
    const { id:mainId } = useParams();
    const navigate = useNavigate();
    console.log(mainId);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://localhost:8008/api/getJobById/${mainId}`);
                console.log(response.data)
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching job:', error);
            }
        };
        fetchJob();
    }, [mainId]);

    if (!formData) {
        return <div>Loading...</div>;  // Show a loading message or spinner until the data is loaded
    }
    console.log(formData);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8008/api/editJob/${mainId}`, formData);
            console.log('Job updated successfully:', response.data);
            navigate('/jobs');
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-24 py-10">
            <h2 className="text-3xl font-bold mb-6">Edit Job Listing</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex justify-between">
                    <div className='w-1/2 mr-2'>
                        <label htmlFor="title" className="block font-bold mb-2">
                            Job Title*
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter job title"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='w-1/2 '>
                        <label htmlFor="location" className="block font-bold mb-2">
                            Location*
                        </label>
                        <input
                            type="text"
                            id="location"
                            placeholder="Enter your location"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-4 flex justify-between">
                    <div className="w-1/3 mr-2">
                        <label htmlFor="jobType" className="block font-bold mb-2">
                            Job Type*
                        </label>
                        <select
                            id="jobType"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={formData.jobType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">-Select-</option>
                            <option value="fulltime">Full-time</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    <div className="w-1/3 mr-2">
                        <label htmlFor="category" className="block font-bold mb-2">
                            Category*
                        </label>
                        <select
                            id="category"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">-Select-</option>
                            <option value="sales">Sales</option>
                            <option value="marketing">Marketing</option>
                            <option value="engineering">Engineering</option>
                            <option value="design">Design</option>
                        </select>
                    </div>

                    <div className="w-1/3 mr-2">
                        <label htmlFor="experienceLevel" className="block font-bold mb-2">
                            Experience Level*
                        </label>
                        <select
                            id="experienceLevel"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={formData.experienceLevel}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">-Select-</option>
                            <option value="entry">Entry Level</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block font-bold mb-2">
                        Job Description*
                    </label>
                    <textarea
                        id="description"
                        placeholder="Write a job description"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="4"
                    ></textarea>
                </div>

                <div className="mb-8">
                    <label htmlFor="requirements" className="block font-bold mb-2">
                        Job Requirements*
                    </label>
                    <textarea
                        id="requirements"
                        placeholder="Write job requirements"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        required
                        rows="4"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button type="button" onClick={handleSubmit} name="createJob" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Update Job
                    </button>
                    {/* <button type="button" onClick={handleSaveForLater} name="saveForLater" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
                        Save for Later
                    </button> */}
                </div>
            </form>
        </div>
    );
};

export default EditJobs;
