import { Card } from "@nextui-org/card";
import React from "react";

const DashboardDetails = ({ title, subtitle, summaryData }) => {
  return (
    <div>
      {/* Title and Subtitle */}
      <div className="mb-8 text-left">
        <h3 className="text-blue-gray-700">{title}</h3>
        <h6 className="text-blue-gray-700">{subtitle}</h6>
      </div>

      {/* Summary Box */}
      <div className="mb-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {summaryData.map((item, index) => (
          <Card
            key={index}
            color="transparent"
            shadow={2}
            className="flex flex-col w-[100%] h-[150px] items-start justify-center p-4"
          >
            <h6 className="text-gray-700 mb-2 text-left text-[0.9rem]">
              {item.title}
            </h6>
            <h4 className="text-blue-gray-700">{item.value}</h4>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardDetails;
