import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listFeedbacks } from "../../api/api"; // Import the API function
import Loader from "../../components/Loader/Loader"; // Ensure correct import
import DashboardDetails from "../../components/DashboardDetails/DashboardDetails";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { RiStarSFill, RiStarSLine } from "react-icons/ri";
import { formatTimeElapsed } from "../../utils";
const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if the token is missing
      toast.error("You need to be logged in to access this page.");
      setTimeout(() => {
        navigate("/onboarding/login");
      }, 2000);
      return;
    }

    // Fetch feedback data
    const fetchFeedbacks = async () => {
      try {
        setLoading(true); // Set loading true before starting the request
        const response = await listFeedbacks(token);

        // Introduce a 2-second delay before setting the feedbacks
        setTimeout(() => {
          setFeedbackData(response.data);
          setTotalFeedbacks(response.data.length);
          toast.info(`Total Feedback ${response.data.length}`);
          setLoading(false); // Stop loading after the delay
        }, 1500); // 2-second delay
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Failed to load feedback data. Please try again later.");
        navigate(
          role === "admin" ? "/onboarding/admin-login" : "/onboarding/login",
        );
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader /> {/* Ensure Loader is properly implemented */}
      </div>
    );
  }

  const summaryData = [
    {
      title: "Total Notifications",
      value: totalFeedbacks,
    },
  ];
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<RiStarSFill key={i} className="text-yellow-500" />);
      } else {
        stars.push(<RiStarSLine key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex px-4 py-2 lg:px-8 lg:py-4">
      {/* Main Content */}
      <div className="w-full md:w-[75%] ml-[20%] p-8 overflow-y-auto">
        <DashboardDetails
          title={`MaxHelp Business ${role !== "admin" ? "Employee" : "Admin"} - Dashboard`}
          subtitle="Feedback Details Page"
          summaryData={summaryData}
        />

        {/* Feedback Grid Section */}
        <div className="space-y-4">
          {feedbackData.length > 0 ? (
            feedbackData.map(
              (
                { id, customer_name, unit_name, comment, rating, created_at },
                index,
              ) => (
                <Card
                  key={id}
                  className="flex flex-col items-center justify-between space-y-0 p-2 gap-0"
                >
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row items-center justify-between space-y-0 mb-2">
                      <span className="text-xs font-bold text-blue-gray-800">
                        from {unit_name}
                      </span>
                      <span className="text-xs font-bold text-blue-gray-800">
                        {formatTimeElapsed(created_at)}
                      </span>
                    </div>

                    <h4 className="text-base text-blue-gray-900">
                      {customer_name}
                    </h4>
                  </div>
                  <CardBody className="px-3 py-1 text-[0.85rem]">
                    <p className="text-blue-gray-700 py-1">{comment}</p>

                    <div className="flex items-center mb-1">
                      <strong className="text-sm text-blue-gray-700 mr-2">
                        Rating:
                      </strong>
                      {renderStars(rating)}
                    </div>
                  </CardBody>
                </Card>
              ),
            )
          ) : (
            <p className="mt-4 text-sm">No feedback available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
