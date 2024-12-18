import Units from "../../components/Units/Units";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import HomeFeedbacksCarousel from "../../components/FeedbackCarousel/HomeFeedBackCarousel";

const HomePage = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/onboarding/login");
  };
  return (
    <div className="homePage container mx-auto px-4 py-2 lg:px-8 lg:py-4 text-blue-gray-900 my-[4rem]">
      <div className="mt-[3rem] mb-[3rem]">
        <div className="flex items-center justify-between gap-5">
          <div className="left flex flex-col items-start gap-3 space-y-3">
            <h2 className="text-[2rem]">
              Welcome to <span className="text-primary">MaxHelp Business </span>
              Enterprises
            </h2>
            <h4 className="text-[1.3rem]">Empowering Your Journey</h4>
            <p className=" text-[0.8rem]">
              Your number one solution provider for innovative, reliable, and
              results-driven services. At MaxHelp, we prioritize your success,
              enabling you to achieve your business goals effortlessly.
            </p>
            <div className="">
              <Button color="primary" variant="shadow" onClick={redirect}>
                Get Started
              </Button>
            </div>
          </div>

          <div className="hidden md:flex object-cover w-[85%] border-blue-gray-500">
            <img src={"/Group Members.png"} alt="" className="w-98%" />
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="top my-[4rem] mt-[5rem] mb-[5rem]">
          <div className="text-center uppercase">
            <h4 className="font-bold text-2xl">Explore our Business Units</h4>
          </div>
          <Units />
        </div>

        <div className="bottom">
          <div className="top my-[4rem] mt-[5rem] mb-[5rem]">
            <div className="text-center uppercase">
              <h4 className="text-2xl font-bold">Testimonials </h4>
            </div>
            <HomeFeedbacksCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
