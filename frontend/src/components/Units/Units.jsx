import { Card, CardBody } from "@nextui-org/card";
import units from "../../api/unit";

const Units = () => {
  return (
    <div className="container mt-[2.5rem] mx-auto px-4 py-2 lg:px-8 lg:py-4 cursor-pointer w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {units.map((unit, index) => (
          <Card
            key={index}
            className="shadow-lg hover:shadow-xl py-2 px-2 transition-shadow"
          >
            <div className="">
              <h5 className="text-[1rem] text-center">{unit.unit_name}</h5>
            </div>

            <CardBody
              className="flex items-start
            flex-col gap-2"
            >
              <h6 className="mb-3">
                <strong>Location:</strong> {unit.unit_location}
              </h6>
              <p>Description: {unit.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Units;
