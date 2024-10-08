import React, { useEffect, useState } from 'react'
import axios from '../../api/axios';
import Header from '../../components/utility/Header';
import StatsGrid from '../../components/StatsGrid';
import one from '../../svg/StatsCard/Jobs Page/one';
import Scorer from '../../components/ui/Scorer';
import { Button } from '../../components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Total from '../../svg/StatsCard/View Candidate/Total';
import Portfolio from '../../svg/StatsCard/View Candidate/Portfolio';
import Screening from '../../svg/StatsCard/View Candidate/Screening';
import DesignTask from '../../svg/StatsCard/View Candidate/DesignTask';
import Round1 from '../../svg/StatsCard/View Candidate/Round1';
import Round2 from '../../svg/StatsCard/View Candidate/Round2';
import OfferSent from '../../svg/StatsCard/View Candidate/OfferSent';


const statsOne = [
  { title: 'Total', value: 0, icon: Total },
  { title: 'Portfolio', value: 0, icon: Portfolio },
  { title: 'Screening', value: 0, icon: Screening },
  { title: 'Design Task', value: 0, icon: DesignTask },
  // { title: 'Round 1', value: 0, icon: Round1 },
  // { title: 'Round 2', value: 0, icon: Round2 },
  // { title: 'Offer Sent', value: 0, icon: OfferSent },
]


const PortfolioReview = ({ candidate, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onSubmit(candidate._id, { rating, feedback });
  };

  return (
    <div className='bg-background-90 flex gap-4 justify-between items-center p-4'>
      <span className='flex-shrink-0'>Portfolio ratings</span>
      <Scorer value={rating} onChange={setRating} />
      <input
        type="text"
        className='w-full bg-background-80 text-white p-2 rounded'
        placeholder='Enter Your Feedback'
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button variant="icon" onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

const ScreeningReview = ({ candidate, onSubmit }) => {
  const [ratings, setRatings] = useState({
    Attitude: 0, Communication: 0, UX: 0, UI: 0, Tech: 0
  });
  const [feedback, setFeedback] = useState('');

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    onSubmit(candidate._id, { ratings, feedback });
  };

  return (
    <div className='bg-background-90 grid grid-cols-2 gap-4 p-4'>
      {Object.entries(ratings).map(([category, value]) => (
        <div key={category} className='flex gap-4 items-center'>
          <span className='w-32'>{category}</span>
          <Scorer value={value} onChange={(v) => handleRatingChange(category, v)} />
        </div>
      ))}
      <div className='flex gap-4'>

        <input
          type="text"
          className='w-full bg-background-80 text-white p-2 rounded'
          placeholder='Enter Your Feedback'
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div>
          <Button variant="icon" onClick={handleSubmit}>Submit</Button>

        </div>
      </div>

    </div>
  );
};

const RoundReview = ({ roundNumber, candidate, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onSubmit(candidate._id, {
      stage: `Round ${roundNumber}`,
      rating,
      feedback
    });
  };

  return (
    <div className='bg-background-100 flex gap-4 justify-between items-center p-4'>
      <span className='flex-shrink-0'>{`Round ${roundNumber} ratings`}</span>
      <Scorer value={rating} onChange={setRating} />
      <input
        type="text"
        className='w-full bg-background-80 text-white p-2 rounded'
        placeholder='Enter Your Feedback'
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button variant="icon" onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

const Round1Review = (props) => <RoundReview roundNumber={1} {...props} />;
const Round2Review = (props) => <RoundReview roundNumber={2} {...props} />;

// API functions
const fetchCandidates = async () => {
  const response = await axios.get('dr/assigned-candidates');
  return response.data;
};

const submitReview = async ({ candidateId, reviewData }) => {
  const response = await axios.post(`dr/submit-review/${candidateId}`, reviewData);
  return response.data;
};


const Reviews = () => {
  const queryClient = useQueryClient();

  // Fetch candidates
  const { data: candidates, isLoading, isError, error } = useQuery({
    queryKey: ['assignedCandidates'],
    queryFn: fetchCandidates,
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['assignedCandidates'] });
    },
  });

  const groupCandidatesByJobAndStage = (candidates) => {
    return candidates.reduce((jobAcc, candidate) => {
      candidate.jobApplications.forEach(application => {
        if (!jobAcc[application.jobTitle]) {
          jobAcc[application.jobTitle] = {};
        }
        if (!jobAcc[application.jobTitle][application.currentStage]) {
          jobAcc[application.jobTitle][application.currentStage] = [];
        }
        jobAcc[application.jobTitle][application.currentStage].push({ ...candidate, currentApplication: application });
      });
      return jobAcc;
    }, {});
  };
  const handleReviewSubmit = (candidateId, reviewData) => {
    submitReviewMutation.mutate({ candidateId, reviewData });
  };

  const renderReviewComponent = (candidate) => {
    switch (candidate.currentApplication.currentStage) {
      case 'Portfolio':
        return <PortfolioReview candidate={candidate} onSubmit={handleReviewSubmit} />;
      case 'Screening':
        return <ScreeningReview candidate={candidate} onSubmit={handleReviewSubmit} />;
      case 'Round 1':
        return <Round1Review candidate={candidate} onSubmit={handleReviewSubmit} />;
      case 'Round 2':
        return <Round2Review candidate={candidate} onSubmit={handleReviewSubmit} />;
      default:
        return null;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;


  const groupedCandidates = groupCandidatesByJobAndStage(candidates);

  // Define the order of stages
  const stageOrder = ['Portfolio', 'Screening', 'Round 1', 'Round 2'];

  return (
    <div>
      <Header HeaderText="Reviews" />
      <div className='bg-background-30 m-6 p-6 rounded-xl'>
        <StatsGrid stats={statsOne} />
        {Object.entries(groupedCandidates).map(([jobTitle, stages]) => (
          <div key={jobTitle} className="mb-8">
            <h1 className="typography-h1 mb-4">{jobTitle}</h1>
            {stageOrder.map(stage => {
              if (stages[stage] && stages[stage].length > 0) {
                return (
                  <div key={stage} className="mb-6 ">
                    <h2 className="typography-h2 mb-3">{stage}</h2>
                    {stages[stage].map(candidate => (
                      <div key={`${candidate._id}-${candidate.currentApplication.jobId}`} className="mb-4 bg-background-70">
                        <span className="typography-body mb-2 ml-4  ">
                          {candidate.firstName} {candidate.lastName}
                        </span>
                        {renderReviewComponent(candidate)}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;