//dr.controller.js

import mongoose from "mongoose";
import { jobs } from "../../models/admin/jobs.model.js";
import { candidates } from "../../models/candidate/candidate.model.js";
import { updateStatusOnAssigneeChange } from "../../utils/statusManagement.js";
import { jobStagesStatuses } from "../../config/jobStagesStatuses.js";

// export const updateAssignee = async (req, res) => {
//   try {
//     const { candidateId, jobId, stage, assigneeId } = req.body;

//     // Find the candidate
//     const candidate = await candidates.findById(candidateId);
//     if (!candidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }

//     // Find the specific job application
//     const jobApplication = candidate.jobApplications.find(
//       (app) => app.jobId.toString() === jobId
//     );
//     if (!jobApplication) {
//       return res.status(404).json({ message: 'Job application not found' });
//     }

//     // Initialize or update the stage status
//     if (!jobApplication.stageStatuses[stage]) {
//       jobApplication.stageStatuses[stage] = {
//         status: 'Not Assigned',
//         assignedTo: null,
//         rejectionReason: "N/A",
//         score: {},
//         currentCall: null,
//         callHistory: []
//       };
//     }

//     // Update the assignee and status
//     jobApplication.stageStatuses[stage].assignedTo = assigneeId;
//     jobApplication.stageStatuses[stage].status = assigneeId ? 'Under Review' : 'Not Assigned';

//     // Update the current stage if an assignee is added
//     if (assigneeId) {
//       jobApplication.currentStage = stage;
//     }

//     // Save the changes
//     await candidate.save();

//     res.status(200).json({ 
//       message: 'Assignee updated successfully',
//       updatedStageStatus: jobApplication.stageStatuses[stage],
//       currentStage: jobApplication.currentStage
//     });
//   } catch (error) {
//     console.error('Error updating assignee:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const updateCandidateAssignee = async (req, res) => {
  try {
    const { candidateId, jobId, stage, assigneeId } = req.body;

    // Find the candidate
    const candidate = await candidates.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Find the specific job application
    const jobApplication = candidate.jobApplications.find(
      (app) => app.jobId.toString() === jobId
    );
    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // Initialize the stage status if it doesn't exist
    if (!jobApplication.stageStatuses.has(stage)) {
      jobApplication.stageStatuses.set(stage, {
        status: 'Not Assigned',
        assignedTo: null,
        rejectionReason: 'N/A',
        score: {},
        currentCall: null,
        callHistory: []
      });
    }

    const stageStatus = jobApplication.stageStatuses.get(stage);

    // Update the assignee
    stageStatus.assignedTo = assigneeId;

    // Update the status based on the stage
    if (stage === 'Portfolio') {
      stageStatus.status = assigneeId ? 'Under Review' : 'Not Assigned';
    }
    // Add more stage-specific logic here as needed

    // If this is the first stage and an assignee is added, update the current stage
    if (stage === 'Portfolio' && assigneeId && !jobApplication.currentStage) {
      jobApplication.currentStage = stage;
    }

    // Save the changes
    await candidate.save();

    res.status(200).json({ 
      message: 'Assignee updated successfully',
      updatedStageStatus: stageStatus,
      currentStage: jobApplication.currentStage
    });
  } catch (error) {
    console.error('Error updating assignee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  export const getAssignedCandidates = async (req, res) => {
    try {
      const designReviewerId = new mongoose.Types.ObjectId(req.user._id);
  
      // Create a dynamic $or condition for all possible stages across all job profiles
      const stageConditions = Object.values(jobStagesStatuses).flatMap(stages => 
        stages.map(stage => ({
          [`jobApplications.stageStatuses.${stage.name}.assignedTo`]: designReviewerId
        }))
      );
  
      const assignedCandidates = await candidates.aggregate([
        { $unwind: '$jobApplications' },
        {
          $match: {
            $or: stageConditions
          }
        },
        {
          $group: {
            _id: '$_id',
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            jobApplications: { $push: '$jobApplications' }
          }
        }
      ]);
  
      const candidatesWithJobDetails = await Promise.all(assignedCandidates.map(async (candidate) => {
        const candidateWithJobs = {
          ...candidate,
          jobApplications: await Promise.all(candidate.jobApplications.map(async (application) => {
            let job;
            try {
              job = await jobs.findById(application.jobId);
              if (!job) {
                console.log(`Job not found for ID: ${application.jobId}`);
              }
            } catch (error) {
              console.error(`Error fetching job with ID ${application.jobId}:`, error);
            }
  
            const jobProfile = job ? job.jobProfile : application.jobProfile || 'Unknown Profile';
            const stages = jobStagesStatuses[jobProfile] || [];
            
            // If stages are empty, log this unusual situation
            if (stages.length === 0) {
              console.log(`No stages found for job profile: ${jobProfile}`);
            }
  
            // Filter stageStatuses to include only the stages for this job profile
            const filteredStageStatuses = {};
            Object.keys(application.stageStatuses).forEach(stageName => {
              if (stages.some(stage => stage.name === stageName)) {
                filteredStageStatuses[stageName] = application.stageStatuses[stageName];
              }
            });
  
            return {
              ...application,
              jobTitle: job ? job.jobTitle : application.jobApplied || 'Unknown Job',
              jobProfile,
              stageStatuses: filteredStageStatuses
            };
          }))
        };
        return candidateWithJobs;
      }));
  
      res.status(200).json(candidatesWithJobDetails);
    } catch (error) {
      console.error('Error fetching assigned candidates:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const autoAssignPortfolios = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { jobId, reviewerIds } = req.body;
  
      if (!jobId || !reviewerIds || reviewerIds.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Job ID and at least one reviewer ID are required.' });
      }
  
      // Find all candidates for the given job in Portfolio stage with Not Assigned status
      const eligibleCandidates = await candidates.find({
        'jobApplications': {
          $elemMatch: {
            jobId: new mongoose.Types.ObjectId(jobId),
            currentStage: 'Portfolio',
            'stageStatuses.Portfolio.status': 'Not Assigned'
          }
        }
      }).session(session);
  
      if (eligibleCandidates.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'No eligible candidates found for assignment.' });
      }
  
      // Calculate how many candidates each reviewer should get
      const candidatesPerReviewer = Math.floor(eligibleCandidates.length / reviewerIds.length);
      let remainingCandidates = eligibleCandidates.length % reviewerIds.length;
  
      let assignmentCount = 0;
      const assignments = {};
  
      // Distribute candidates among reviewers
      for (let i = 0; i < eligibleCandidates.length; i++) {
        const candidate = eligibleCandidates[i];
        const reviewerIndex = Math.floor(i / (candidatesPerReviewer + (remainingCandidates > 0 ? 1 : 0)));
        const reviewerId = reviewerIds[reviewerIndex];
  
        // Update candidate
        const jobApplication = candidate.jobApplications.find(app => app.jobId.toString() === jobId);
        if (jobApplication) {
          jobApplication.stageStatuses.Portfolio = {
            ...jobApplication.stageStatuses.Portfolio,
            status: 'Under Review',
            assignedTo: new mongoose.Types.ObjectId(reviewerId)
          };
          await candidate.save({ session });
          assignmentCount++;
  
          // Track assignments for response
          if (!assignments[reviewerId]) {
            assignments[reviewerId] = 0;
          }
          assignments[reviewerId]++;
        }
  
        if (i === (candidatesPerReviewer + (remainingCandidates > 0 ? 1 : 0)) * (reviewerIndex + 1) - 1) {
          remainingCandidates--;
        }
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({
        message: 'Auto-assignment completed successfully',
        totalAssigned: assignmentCount,
        assignments: assignments
      });
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error in autoAssignPortfolios:', error);
      res.status(500).json({ message: 'Server error during auto-assignment' });
    }
  };