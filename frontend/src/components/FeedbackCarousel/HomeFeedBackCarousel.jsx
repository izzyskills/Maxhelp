import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { listHomeFeedbacks } from "../../api/api";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { RiStarSFill, RiStarSLine } from "react-icons/ri";
import { formatTimeElapsed } from "../../utils";

const HomeFeedbacksCarousel = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch feedback data
    const fetchFeedbacks = async () => {
      try {
        setLoading(true); // Set loading true before starting the request
        const response = await listHomeFeedbacks(); // No token required

        setFeedbackData(response.data);
        toast.info(`Total Feedback ${response.data.length}`);
        setLoading(false); // Stop loading after setting the feedbacks
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Failed to load feedback data. Please try again later.");
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };

    fetchFeedbacks();
  }, []);
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

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="container mt-[2.5rem] mx-auto px-4 py-2 lg:px-8 lg:py-4 cursor-pointer w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbackData.length > 0 ? (
          feedbackData.map(
            (
              { id, customer_name, unit_name, comment, rating, created_at },
              index,
            ) => (
              <Card
                key={id}
                className="shadow-lg hover:shadow-xl py-2 px-2 transition-shadow"
              >
                <div className="flex flex-col w-full ">
                  <div className="flex flex-row items-center justify-between space-y-0 mb-2">
                    <span className="text-xs font-bold text-blue-gray-800">
                      from {unit_name}
                    </span>
                    <span className="text-xs font-bold text-blue-gray-800">
                      {formatTimeElapsed(created_at)}
                    </span>
                  </div>

                  <h4 className="text-xl text-bold ">{customer_name}</h4>
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
  );
};

export default HomeFeedbacksCarousel;
