import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  LoaderCircle,
  UserRound,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState, useRef, useCallback } from "react";
import { PopoverClose } from "@radix-ui/react-popover";

interface ClientInfoProps {
  setCounter: () => void; // goes to next step
  goToStep: (index: number) => void; // optional, for back
  handleReportID: (
    id: string,
    formInspection: boolean,
    formFumigation: boolean
  ) => void;
  userCPO: string;
  userName: string;
  userCell: string;
}

const ClientInfo: React.FC<ClientInfoProps> = ({
  setCounter,
  goToStep,
  handleReportID,
  userCPO,
}) => {
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientNr, setClientNr] = useState<string>("");
  const [clientAddr, setClientAddr] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(false);
  const [formInspection, setFormInspection] = useState<boolean>(true);
  const [formFumigation, setFormFumigation] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchClient = async (clientEmail: string): Promise<void> => {
    if (clientEmail.length === 0) return;
    setLoading(true);
    const response: Response = await fetch("/portal_api/search_client.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_email: clientEmail,
      }),
    });
    if (!response.ok) {
      setClientName("");
      setClientNr("");
      setClientAddr("");
      setLoading(false);
      return;
    }
    try {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const client = result.data[0];
          setClientName(client.client_name);
          setClientNr(client.client_cell);
          setClientAddr(client.client_address);
        } else {
          setClientName("");
          setClientNr("");
          setClientAddr("");
        }
      } else {
        setClientName("");
        setClientNr("");
        setClientAddr("");
      }
    } catch {
      setClientName("");
      setClientNr("");
      setClientAddr("");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearchClient = useCallback((email: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      searchClient(email);
    }, 500);
  }, []);

  useEffect(() => {
    if (clientEmail.length > 0) {
      debouncedSearchClient(clientEmail);
    } else {
      setClientName("");
      setClientNr("");
      setClientAddr("");
    }
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [clientEmail, debouncedSearchClient]);

  const saveClient = async (
    name: string,
    email: string,
    cell: string,
    address: string,
    date: string | Date | null | undefined
  ): Promise<void> => {
    if (
      name.length === 0 ||
      email.length === 0 ||
      cell.length === 0 ||
      address.length === 0 ||
      userCPO.length === 0 ||
      date == null ||
      date == undefined
    )
      return;
    setLoading(true);
    // Format date as local date string (YYYY-MM-DD) to avoid timezone issues
    const formattedDate =
      date instanceof Date ? format(date, "yyyy-MM-dd") : date;

    const response: Response = await fetch("/portal_api/save_client.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_name: name,
        client_email: email,
        client_cell: cell,
        client_address: address,
        user_id: userCPO,
        report_date: formattedDate,
        form_inspection: formInspection,
        form_fumigation: formFumigation,
      }),
    });
    if (!response.ok) {
      setLoading(false);
      return;
    }
    try {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success && result.report_id) {
          // Pass back report_id + form choices
          handleReportID(result.report_id, formInspection, formFumigation);
          setCounter(); // move to next step
        }
      }
    } catch {
      // silent catch
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
      {loading && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-md rounded-full px-4 py-2">
          <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Loading...
          </span>
        </div>
      )}
      <div className="w-full h-full py-12">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="flex justify-between w-full px-4 py-6">
            <div className="flex items-center text-left">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToStep(0)}
                className="flex items-center gap-1 mr-2"
                type="button"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <span className="rounded-xl border-0 bg-gray-100 border-gray-800 w-10 h-10 flex justify-center items-center mr-2">
                <UserRound className="text-gray-800" size={20} />
              </span>
              <span className="text-2xl">Client Info</span>
            </div>
          </h1>
          {/* Email */}
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label htmlFor="clientEmail" className="text-gray-600">
              Email
            </Label>
            <Input
              name="clientEmail"
              type="email"
              placeholder="Enter Email"
              className="bg-white mt-4"
              onChange={(e) => setClientEmail(e.target.value)}
              value={clientEmail}
            />
          </div>
          {/* Name */}
          <div className="px-4 py-2 w-full max-w-md">
            <Label htmlFor="clientName" className="text-gray-600">
              Name
            </Label>
            <Input
              name="clientName"
              placeholder="Enter Name"
              className="bg-white mt-4"
              onChange={(e) => setClientName(e.target.value)}
              value={clientName}
            />
          </div>
          {/* Contact */}
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label htmlFor="clientNr" className="text-gray-600">
              Contact Number
            </Label>
            <Input
              name="clientNr"
              type="number"
              placeholder="Enter Contact Number"
              className="bg-white mt-4"
              onChange={(e) => setClientNr(e.target.value)}
              value={clientNr}
            />
          </div>
          {/* Address */}
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label htmlFor="clientAddr" className="text-gray-600">
              Address
            </Label>
            <Input
              name="clientAddr"
              type="text"
              placeholder="Enter Address"
              className="bg-white mt-4"
              onChange={(e) => setClientAddr(e.target.value)}
              value={clientAddr}
            />
          </div>
          {/* Date */}
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label className="text-gray-600 mb-4">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex m-1">
                  <div className="flex-1"></div>
                  <PopoverClose>
                    <X
                      size={24}
                      className="text-primary/60 hover:text-destructive"
                    />
                  </PopoverClose>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) =>
                    setDate(selectedDate ?? undefined)
                  }
                  toDate={new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Sections Checkboxes */}
          <div className="px-4 py-2 mt-4 w-full max-w-md flex flex-col gap-2">
            <Label className="text-gray-600 mb-1">Report Sections</Label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formInspection}
                onChange={(e) => setFormInspection(e.target.checked)}
                className="accent-primary"
              />
              Inspection Bait Stations
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formFumigation}
                onChange={(e) => setFormFumigation(e.target.checked)}
                className="accent-primary"
              />
              Fumigation report
            </label>
          </div>
          {/* Buttons */}
          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Button
              onClick={() =>
                saveClient(
                  clientName,
                  clientEmail,
                  clientNr,
                  clientAddr,
                  date as Date
                )
              }
              className="w-full"
              disabled={!formInspection && !formFumigation}
            >
              Start Report <ArrowRight />
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 mt-4 w-full max-w-md"
              onClick={() => goToStep(0)} // Back to "User"
            >
              <ArrowLeft /> Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;
