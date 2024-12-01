import { Spinner } from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" />
    </div>
  );
};

export default Loader;
