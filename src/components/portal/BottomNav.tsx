import { AlignLeft, FilePenLine, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (
      route === "/portal" &&
      (path === "/portal" || path === "/portal/form")
    ) {
      return true;
    }
    if (route !== "/portal" && path.includes(route)) {
      return true;
    }
    return false;
  };

  return (
    <div className="h-[8dvh] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center px-4">
      <Link
        to="/portal/report"
        className={cn(
          "w-[20%] h-[80%] flex flex-col items-center justify-center p-2 rounded-lg transition-all relative",
          isActive("/portal/report")
            ? "text-primary bg-primary/10 scale-105 font-medium"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800"
        )}
      >
        {" "}
        {isActive("/portal/report") && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-theme-500 rounded-full" />
        )}
        <AlignLeft
          className={cn(
            "size-6",
            isActive("/portal/report") ? "stroke-[2.5px]" : ""
          )}
        />
        <span className="text-xs mt-1 font-medium">Reports</span>
      </Link>
      <Link
        to="/portal/form"
        className={cn(
          "w-[20%] h-[80%] flex flex-col items-center justify-center p-2 rounded-lg transition-all relative",
          isActive("/portal")
            ? "text-primary bg-primary/10 scale-105 font-medium"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800"
        )}
      >
        {" "}
        {isActive("/portal") && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-theme-500 rounded-full" />
        )}
        <FilePenLine
          className={cn("size-6", isActive("/portal") ? "stroke-[2.5px]" : "")}
        />
        <span className="text-xs mt-1 font-medium">Form</span>
      </Link>
      <Link
        to="/portal/client"
        className={cn(
          "w-[20%] h-[80%] flex flex-col items-center justify-center p-2 rounded-lg transition-all relative",
          isActive("/portal/client")
            ? "text-primary bg-primary/10 scale-105 font-medium"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800"
        )}
      >
        {" "}
        {isActive("/portal/client") && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-theme-500 rounded-full" />
        )}
        <UsersRound
          className={cn(
            "size-6",
            isActive("/portal/client") ? "stroke-[2.5px]" : ""
          )}
        />
        <span className="text-xs mt-1 font-medium">Clients</span>
      </Link>
    </div>
  );
};

export default BottomNav;
