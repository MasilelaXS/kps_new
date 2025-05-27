import { ArrowRight, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";

interface UserProps {
  setCounter: (step: number) => void;
  handleUser: (cpo: string, id: string, name: string) => void;
}

const User: React.FC<UserProps> = ({ setCounter, handleUser }) => {
  const [cpoNr, setCpoNr] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userCell, setUserCell] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchUser = async (cpoNr: string): Promise<void> => {
    if (cpoNr.length === 0) return;
    const response: Response = await fetch("/portal_api/search_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_cpo: cpoNr,
      }),
    });
    if (!response.ok) {
      setUserName("");
      setUserCell("");
      return;
    }
    try {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const user = result.data[0];
          setUserName(user.username);
          setUserCell(user.user_cell);
        } else {
          setUserName("");
          setUserCell("");
        }
      } else {
        setUserName("");
        setUserCell("");
      }
    } catch {
      setUserName("");
      setUserCell("");
    }
  };

  // Debounced search function
  const debouncedSearchUser = useCallback((cpoNumber: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      searchUser(cpoNumber);
    }, 500);
  }, []);

  useEffect(() => {
    if (cpoNr.length > 0) {
      debouncedSearchUser(cpoNr);
    } else {
      setUserName("");
      setUserCell("");
    }
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cpoNr, debouncedSearchUser]);

  const saveUser = async (
    cpoNr: string,
    userName: string,
    userCell: string
  ): Promise<void> => {
    if (cpoNr.length === 0 || userName.length === 0 || userCell.length === 0)
      return;
    const response: Response = await fetch("/portal_api/save_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_cpo: cpoNr,
        user_name: userName,
        user_cell: userCell,
      }),
    });
    if (!response.ok) {
      return;
    }
    try {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const user = result.data[0];
          handleUser(user.cpo_no, user.username, user.user_cell);
          setCounter(2); // Move to the next step
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
      <div className="w-full h-full py-12 ">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="flex justify-between w-full px-4 py-6 ">
            <div className="flex items-center text-left">
              <span className="rounded-xl border-0 bg-gray-100 border-gray-800 w-10 h-10 flex justify-center items-center mr-2">
                <UserRound className="text-gray-800" size={20} />
              </span>
              <span className="text-2xl">Operator Info</span>
            </div>
          </h1>
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label htmlFor="cpoNr" className="text-gray-600">
              PCO number
            </Label>
            <Input
              name="cpoNr"
              type="number"
              placeholder="Enter PCO number"
              className="bg-white mt-4 "
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCpoNr(e.target.value)
              }
              value={cpoNr}
            />
          </div>
          <div className="px-4 py-2 w-full max-w-md">
            <Label htmlFor="clientName" className="text-gray-600">
              Name
            </Label>
            <Input
              name="clientName"
              placeholder="Enter Name"
              className="bg-white mt-4 "
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserName(e.target.value)
              }
              value={userName}
            />
          </div>
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label htmlFor="userCell" className="text-gray-600">
              Contact number
            </Label>
            <Input
              name="userCell"
              type="number"
              placeholder="Enter Contact Number"
              className="bg-white mt-4 "
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserCell(e.target.value)
              }
              value={userCell}
            />
          </div>
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Button
              onClick={() => saveUser(cpoNr, userName, userCell)}
              className="w-full"
            >
              Next <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
