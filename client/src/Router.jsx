import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import Navbar from "./components/Navbar";
import CreateJobs from "./pages/Admin/CreateJobs";
import Authlayout from "./auth/Authlayout";
import Register from "./pages/Admin/Register";
import EditJobs from "./pages/Admin/EditJobs";
import ViewJobs from "./pages/Admin/ViewJobs";
import ViewCandidateProfile from "./pages/Admin/ViewCandidateProfile";
import Candidates from "./pages/Admin/Candidates";
import ErrorPage from "./pages/Admin/ErrorPage";
import Applyjob from "./pages/Candidate/CandidateViewJob";
import CandidateViewJob from "./pages/Candidate/CandidateViewJob";
import ApplyJob from "./pages/Candidate/ApplyJob";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Navbar />,
    children: [
      {
        path: "jobs",
        element: <Dashboard />,
      },
      {
        path: "candidates",
        element: <Candidates />
      },
      {
        path: "create-job",
        element: <CreateJobs />,
      },
      {
        path: "edit-job/:id",
        element: <EditJobs />
      },
      {
        path: "view-job/:id",
        element: <ViewJobs />,
      },
      {
        path: "view-candidate/:id",
        element: <ViewCandidateProfile />
      }
    ]
  },
  {
    path: "auth",
    element: <Authlayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      }
    ],
  },
  {
    path: "/",
    children:[{
      path: "view-job/:id",
      element: <CandidateViewJob />
    },
    {
      path: "apply-job/:id",
      element: <ApplyJob />
    }
  ],
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);