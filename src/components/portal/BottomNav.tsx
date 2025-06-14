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
    <div className="safe-area-bottom h-20 bg-white dark:bg-gray-900 border-t native-divider flex justify-center items-start px-4 pt-2">
      <div className="flex justify-around items-center w-full max-w-md">
        <Link
          to="/portal/report"
          className={cn(
            "flex-1 max-w-[80px] h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out native-button relative group",
            isActive("/portal/report")
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          )}
        >
          {isActive("/portal/report") && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
          )}
          
          <div className={cn(
            "p-1.5 rounded-xl transition-all duration-200",
            isActive("/portal/report") 
              ? "bg-blue-100 dark:bg-blue-800/30 shadow-sm" 
              : "group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
          )}>
            <AlignLeft
              className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive("/portal/report") ? "stroke-[2.5px]" : "stroke-[2px]"
              )}
            />
          </div>
          
          <span className={cn(
            "text-[10px] mt-0.5 font-medium transition-all duration-200",
            isActive("/portal/report") ? "font-semibold" : ""
          )}>
            Reports
          </span>
        </Link>

        <Link
          to="/portal/form"
          className={cn(
            "flex-1 max-w-[80px] h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out native-button relative group",
            isActive("/portal")
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          )}
        >
          {isActive("/portal") && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
          )}
          
          <div className={cn(
            "p-1.5 rounded-xl transition-all duration-200",
            isActive("/portal") 
              ? "bg-blue-100 dark:bg-blue-800/30 shadow-sm" 
              : "group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
          )}>
            <FilePenLine
              className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive("/portal") ? "stroke-[2.5px]" : "stroke-[2px]"
              )}
            />
          </div>
          
          <span className={cn(
            "text-[10px] mt-0.5 font-medium transition-all duration-200",
            isActive("/portal") ? "font-semibold" : ""
          )}>
            Form
          </span>
        </Link>

        <Link
          to="/portal/client"
          className={cn(
            "flex-1 max-w-[80px] h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ease-out native-button relative group",
            isActive("/portal/client")
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          )}
        >
          {isActive("/portal/client") && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full" />
          )}
          
          <div className={cn(
            "p-1.5 rounded-xl transition-all duration-200",
            isActive("/portal/client") 
              ? "bg-blue-100 dark:bg-blue-800/30 shadow-sm" 
              : "group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
          )}>
            <UsersRound
              className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive("/portal/client") ? "stroke-[2.5px]" : "stroke-[2px]"
              )}
            />
          </div>
          
          <span className={cn(
            "text-[10px] mt-0.5 font-medium transition-all duration-200",
            isActive("/portal/client") ? "font-semibold" : ""
          )}>
            Clients
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
