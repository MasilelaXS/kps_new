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
    <div className="h-[84dvh] bg-white dark:bg-gray-800 overflow-y-auto">
      {currentStep === "User" && (
        <User handleUser={handleUser} setCounter={nextStep} />
      )}
      {currentStep === "ClientInfo" && (
        <ClientInfo
          setCounter={nextStep}
          goToStep={goToStep}
          handleReportID={handleReportID}
          userCPO={userCPO}
          userName={userName}
          userCell={userCell}
        />
      )}
      {currentStep === "Stations" && (
        <Stations
          reportID={reportID}
          setCounter={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === "Rodent" && (
        <Rodent reportID={reportID} setCounter={nextStep} prevStep={prevStep} />
      )}
      {currentStep === "Service" && (
        <Service
          reportID={reportID}
          setCounter={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === "Signature" && (
        <ClientSignature
          reportID={reportID}
          setCounter={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === "Success" && <Success setCounter={goToStep} />}
    </div>
  );
};

export default Form;
