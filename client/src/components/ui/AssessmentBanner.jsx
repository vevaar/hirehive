import React from 'react'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'

const AssessmentBanner = () => {
    const navigate = useNavigate();
    const handleAssessment = () => {
        window.open("/assessment/66e2b7532472fee73b4ea5e8", "_blank");
    }
    return (
        <div className='flex justify-between rounded-xl gap-4 bg-assessment p-6 my-4 items-center bg-cover'>
            <div className='flex gap-4 items-center'>

                <div className='hidden w-16 h-16 rounded-full md:rounded-full bg-primary-100 items-center md:flex justify-center '>

                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Icons" clip-path="url(#clip0_1744_417898)">
                            <path id="Icon" d="M23.5 6L14 15.5L9 10.5L1.5 18M23.5 6H17.5M23.5 6V12" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1744_417898">
                                <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                            </clipPath>
                        </defs>
                    </svg>

                </div>


                <div className='flex-col'>

                    <h2 className='hidden md:flex typography-h2 '>
                        Accelerate
                    </h2>
                    <p className='md:hidden typograhpy-body'>Please Logged into Desktop Version to submit your assessment for high priority selection</p>
                    <p className='hidden md:flex typograhpy-body'>Complete the assessment to be prioritized and improve your chances of moving forward quickly</p>
                </div>

            </div>
            <div className='md:w-[235px] md:flex hidden'>
                <Button variant="primary" onClick={handleAssessment} >Take Assessment</Button>
            </div>
        </div>
    )
}

export default AssessmentBanner