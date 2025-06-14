import { useEffect, useState } from "react";
import Stations from "@/components/portal/form/Stations";
import Service from "@/components/portal/form/Service";
import Rodent from "@/components/portal/form/Rodent";
import User from "@/components/portal/form/User";
import ClientInfo from "@/components/portal/form/ClientInfo";
import Success from "@/components/portal/form/Success";
import ClientSignature from "@/components/portal/form/Signature";

const Form = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<string[]>(["User", "ClientInfo"]);

  const [userCPO, setuserCPO] = useState("");
  const [userName, setUserName] = useState("");
  const [userCell, setUserCell] = useState("");
  const [reportID, setReportID] = useState("");

  useEffect(() => {
    setCurrentStepIndex(0);
    setSteps(["User", "ClientInfo"]); // Initial static steps    // Setup browser history navigation
    const handlePopState = (event: PopStateEvent) => {
      // When the user presses back, go to the specific step from history state
      if (event.state && typeof event.state.step === 'number') {
        setCurrentStepIndex(event.state.step);
      } else {
        // Fallback if no state is available
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Push initial state
    window.history.pushState({ step: 0 }, "");

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleUser = (cpo: string, cell: string, name: string) => {
    setuserCPO(cpo);
    setUserName(name);
    setUserCell(cell);
  };

  const handleReportID = (
    id: string,
    includeInspection: boolean,
    includeFumigation: boolean
  ) => {
    setReportID(id);

    // Construct dynamic steps based on what user selected
    const dynamicSteps = [];

    if (includeInspection) {
      dynamicSteps.push("Stations", "Rodent");
    }
    if (includeFumigation) {
      dynamicSteps.push("Service");
    }

    // Always add Signature and Success at the end
    const allSteps = [
      "User",
      "ClientInfo",
      ...dynamicSteps,
      "Signature",
      "Success",
    ];
    setSteps(allSteps);
  };
  const nextStep = () => {
    const newIndex = currentStepIndex + 1;
    setCurrentStepIndex(newIndex);
    // Add new history entry when moving forward
    window.history.pushState({ step: newIndex }, "");
  };
  const prevStep = () => {
    // Set the step directly rather than using browser history
    const newIndex = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(newIndex);
    // Update the current history entry instead of going back
    window.history.replaceState({ step: newIndex }, "");
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    // Replace current history entry
    window.history.replaceState({ step: index }, "");
  };
  const currentStep = steps[currentStepIndex];

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 relative">
      {/* Progress indicator */}
      <div className="bg-white dark:bg-gray-900 border-b native-divider px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentStep === "User" && "User Information"}
            {currentStep === "ClientInfo" && "Client Details"}
            {currentStep === "Stations" && "Station Management"}
            {currentStep === "Rodent" && "Rodent Control"}
            {currentStep === "Service" && "Service Details"}
            {currentStep === "Signature" && "Signature Required"}
            {currentStep === "Success" && "Report Complete"}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="h-full overflow-y-auto native-scroll">
        <div className="min-h-full">
          {currentStep === "User" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <User handleUser={handleUser} setCounter={nextStep} />
            </div>
          )}
          {currentStep === "ClientInfo" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <ClientInfo
                setCounter={nextStep}
                goToStep={goToStep}
                handleReportID={handleReportID}
                userCPO={userCPO}
                userName={userName}
                userCell={userCell}
              />
            </div>
          )}
          {currentStep === "Stations" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <Stations
                reportID={reportID}
                setCounter={nextStep}
                prevStep={prevStep}
              />
            </div>
          )}
          {currentStep === "Rodent" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <Rodent reportID={reportID} setCounter={nextStep} prevStep={prevStep} />
            </div>
          )}
          {currentStep === "Service" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <Service
                reportID={reportID}
                setCounter={nextStep}
                prevStep={prevStep}
              />
            </div>
          )}
          {currentStep === "Signature" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <ClientSignature
                reportID={reportID}
                setCounter={nextStep}
                prevStep={prevStep}
              />
            </div>
          )}
          {currentStep === "Success" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <Success setCounter={goToStep} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
