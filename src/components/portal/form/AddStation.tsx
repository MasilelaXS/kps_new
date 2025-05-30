import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Poison types arrays with title and L number
const poison_array = [
  { title: "Rodenthor Block", lNumber: "L9396" },
  { title: "Supa Kill - Rat & Mouse Weatbait", lNumber: "L5198" },
  { title: "Supa kill block", lNumber: "L6325" },
  { title: "Bayer Racumin Tracking Powder", lNumber: "L2800" },
];
const non_poison_array = [
  { title: "Supa Kill - Rat & Mouse Block", lNumber: "RDT1008" },
];
const liquid_base_array = [
  { title: "Supa Kill Rat & Mouse Liquid", lNumber: "L5987" },
];

interface StationProps {
  getStations: (reportID: string) => void;
  reportID: string;
}

const AddStation: React.FC<StationProps> = ({ reportID, getStations }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stationNr, setStationNr] = useState<number>(0);
  const [station_activity, setStationActivity] = useState<number>(0);
  const [is_outside, setIsOutside] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>("");
  const [poisonType, setPoisonType] = useState<string>("");
  const [other, setOther] = useState<string>("");
  const [stationL, setStationL] = useState<string>("");
  const [batchNr, setBatchNr] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [is_accessible, setIsAccessible] = useState<boolean>(true);
  const [accessible_reason, setAccessibleReason] = useState<string>("");

  // New state variables for poison selection
  const [poison_selection, setPoisonSelection] = useState<string>("");
  const [poison_qty, setPoisonQty] = useState<number>(0);
  const [qty_unit, setQtyUnit] = useState<string>("Block");

  // Helper function to find L number by poison title
  const findLNumberByTitle = (title: string): string => {
    const allArrays = [
      ...poison_array,
      ...non_poison_array,
      ...liquid_base_array,
    ];
    const found = allArrays.find((item) => item.title === title);
    return found ? found.lNumber : "";
  };

  const saveStation = async (
    stationNr: number,
    station_activity: number,
    is_outside: boolean,
    remark: string,
    poisonType: string,
    stationL: string,
    batchNr: string
  ): Promise<void> => {
    if (
      stationNr === 0 ||
      (is_accessible && station_activity !== 0 && station_activity !== 1) ||
      (is_accessible && remark.trim().length === 0) ||
      (is_accessible && poisonType.trim().length === 0) ||
      (is_accessible &&
        poisonType !== "other" &&
        poison_selection.trim().length === 0) ||
      (!is_accessible && accessible_reason.trim().length === 0)
    ) {
      toast("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response: Response = await fetch("/portal_api/save_station.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_id: reportID,
          station_no: stationNr,
          is_accessible: is_accessible,
          accessible_reason: is_accessible ? null : accessible_reason,
          station_activity: is_accessible ? station_activity : null,
          is_outside: is_outside,
          station_remark: is_accessible ? remark : null,
          station_poison_type: is_accessible ? poisonType : null,
          other: is_accessible && poisonType === "other" ? other : null,
          poison_selection: is_accessible ? poison_selection : null,
          poison_qty: is_accessible ? poison_qty : null,
          qty_unit: is_accessible ? qty_unit : null,
          station_l_no: is_accessible ? stationL : null,
          station_batch_no: is_accessible ? batchNr : null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save station data:", errorText);
        toast("Error saving station data.");
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.success) {
          toast("Station data saved successfully.");

          // Reset form fields after saving
          setStationNr(0);
          setStationActivity(Number(0));
          setIsOutside(false);
          setRemark("");
          setPoisonType("");
          setPoisonSelection("");
          setPoisonQty(0);
          setQtyUnit("Block");
          setOther("");
          setStationL("");
          setBatchNr("");
          setIsAccessible(true);
          setAccessibleReason("");

          // Refresh the stations list
          getStations(reportID);
          setOpen(false);
        } else {
          console.error("Error saving station data:", result.error);
          toast(result.error || "Error saving station data.");
        }
      } else {
        console.error("Unexpected response format. Expected JSON.");
        toast("Error saving station data.");
      }
    } catch (error) {
      console.error("Error saving station data:", error);
      toast("Error saving station data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute bottom-6 right-6 z-20 bg-primary text-white dark:text-gray-800 rounded-full shadow-lg p-4 hover:bg-primary/90 transition-colors flex items-center justify-center"
          type="button"
          aria-label="Add station"
        >
          <Plus className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-w-full max-h-full rounded-none p-0 bg-white dark:bg-gray-900">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Add New Station</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="px-4 py-2 w-full max-w-md">
            <Label
              htmlFor="stationNr"
              className="text-gray-600 dark:text-gray-400"
            >
              Station Number
            </Label>
            <Input
              name="stationNr"
              type="number"
              placeholder="Enter Station Number"
              className="bg-white dark:bg-gray-700 mt-4 "
              onChange={(e) => setStationNr(Number(e.target.value))}
              value={stationNr}
            />{" "}
          </div>

          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label
              htmlFor="isOutside"
              className="text-gray-600 dark:text-gray-400"
            >
              Inside/Outside
            </Label>
            <Select
              onValueChange={(value) => setIsOutside(value === "1")}
              value={`${is_outside ? 1 : 0}`}
            >
              <SelectTrigger className="w-full mt-4">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Inside/Outside</SelectLabel>
                  <SelectItem value="1">Outside</SelectItem>
                  <SelectItem value="0">Inside</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="px-4 py-2 mt-4 w-full max-w-md">
            <Label
              htmlFor="isAccessible"
              className="text-gray-600 dark:text-gray-400"
            >
              Is Accessible?
            </Label>
            <Select
              onValueChange={(value) => setIsAccessible(value === "true")}
              value={is_accessible ? "true" : "false"}
            >
              <SelectTrigger className="w-full mt-4">
                <SelectValue placeholder="Is Accessible?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Is Accessible?</SelectLabel>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {is_accessible ? (
            <>
              <div className="px-4 py-2 mt-4 w-full max-w-md">
                <Label
                  htmlFor="clientEmail"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Activity
                </Label>
                <Select
                  onValueChange={(value) => setStationActivity(Number(value))}
                  value={`${station_activity}`}
                >
                  <SelectTrigger className="w-full mt-4">
                    <SelectValue placeholder="Any Activity?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Any Traces of Activity?</SelectLabel>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>{" "}
                </Select>
              </div>
              <div className="px-4 py-2 mt-4 w-full max-w-md">
                <Label
                  htmlFor="clientEmail"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Remark
                </Label>
                <Select
                  onValueChange={(value) => setRemark(value)}
                  value={`${remark}`}
                >
                  <SelectTrigger className="w-full mt-4">
                    <SelectValue placeholder="Remark" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Remark</SelectLabel>
                      <SelectItem value="cleaned">Cleaned</SelectItem>
                      <SelectItem value="wet">Wet</SelectItem>
                      <SelectItem value="eaten">Eaten</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-4 py-2 mt-4 w-full max-w-md">
                <Label
                  htmlFor="clientEmail"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Poison Type
                </Label>
                <Select
                  onValueChange={(value) => {
                    setPoisonType(value);
                    setPoisonSelection(""); // Reset selection when type changes
                  }}
                  value={`${poisonType}`}
                >
                  <SelectTrigger className="w-full mt-4">
                    <SelectValue placeholder="Select Poison Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Poison Used</SelectLabel>
                      <SelectItem value="poison">Poison</SelectItem>
                      <SelectItem value="non-poison">Non Poison</SelectItem>
                      <SelectItem value="liquid">Liquid Based</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {poisonType === "poison" && (
                <div className="px-4 py-2 mt-4 w-full max-w-md">
                  <Label
                    htmlFor="poison_selection"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Poison Selection
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setPoisonSelection(value);
                      setStationL(findLNumberByTitle(value)); // Auto-fill L number
                    }}
                    value={poison_selection}
                  >
                    <SelectTrigger className="w-full mt-4">
                      <SelectValue placeholder="Select Poison" />
                    </SelectTrigger>
                    <SelectContent>
                      {" "}
                      <SelectGroup>
                        <SelectLabel>Select Poison</SelectLabel>
                        {poison_array.map((item) => (
                          <SelectItem key={item.title} value={item.title}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {poisonType === "non-poison" && (
                <div className="px-4 py-2 mt-4 w-full max-w-md">
                  <Label
                    htmlFor="poison_selection"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Non-Poison Selection
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setPoisonSelection(value);
                      setStationL(findLNumberByTitle(value)); // Auto-fill L number
                    }}
                    value={poison_selection}
                  >
                    <SelectTrigger className="w-full mt-4">
                      <SelectValue placeholder="Select Non-Poison" />
                    </SelectTrigger>
                    <SelectContent>
                      {" "}
                      <SelectGroup>
                        <SelectLabel>Select Non-Poison</SelectLabel>
                        {non_poison_array.map((item) => (
                          <SelectItem key={item.title} value={item.title}>
                            {item.title} ({item.lNumber})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {poisonType === "liquid" && (
                <div className="px-4 py-2 mt-4 w-full max-w-md">
                  <Label
                    htmlFor="poison_selection"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Liquid Selection
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setPoisonSelection(value);
                      setStationL(findLNumberByTitle(value)); // Auto-fill L number
                    }}
                    value={poison_selection}
                  >
                    <SelectTrigger className="w-full mt-4">
                      <SelectValue placeholder="Select Liquid" />
                    </SelectTrigger>
                    <SelectContent>
                      {" "}
                      <SelectGroup>
                        <SelectLabel>Select Liquid</SelectLabel>
                        {liquid_base_array.map((item) => (
                          <SelectItem key={item.title} value={item.title}>
                            {item.title} ({item.lNumber})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {poisonType === "other" && (
                <div className="px-4 py-2 mt-4 w-full max-w-md">
                  <Label
                    htmlFor="other"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Other Poison
                  </Label>
                  <Input
                    name="other"
                    type="text"
                    placeholder="Enter Other Poison Type"
                    className="bg-white dark:bg-gray-700 mt-4"
                    onChange={(e) => setOther(e.target.value)}
                    value={other}
                  />
                </div>
              )}
              {poisonType && (
                <div className="px-4 py-2 mt-4 w-full max-w-md">
                  <Label
                    htmlFor="poison_qty"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Quantity
                  </Label>{" "}
                  <div className="flex mt-4 gap-2">
                    <Input
                      name="poison_qty"
                      type="number"
                      step={
                        qty_unit === "ml" ||
                        qty_unit === "kg" ||
                        qty_unit === "g"
                          ? "0.05"
                          : "1"
                      }
                      placeholder="Enter Quantity"
                      className="bg-white dark:bg-gray-700 flex-1"
                      onChange={(e) => setPoisonQty(Number(e.target.value))}
                      value={poison_qty}
                    />
                    <Select
                      onValueChange={(value) => {
                        setQtyUnit(value);
                        // If changing from ml to another unit, round to integer
                        if (value !== "ml") {
                          setPoisonQty(Math.round(poison_qty));
                        }
                      }}
                      value={qty_unit}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Block">Block</SelectItem>
                          <SelectItem value="Tank">Tank</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}{" "}
              <div className="px-4 py-2 mt-4 w-full max-w-md">
                <Label
                  htmlFor="stationL"
                  className="text-gray-600 dark:text-gray-400"
                >
                  L Number
                </Label>
                <Input
                  name="stationL"
                  type="text"
                  placeholder="Enter L Number"
                  className="bg-white dark:bg-gray-700 mt-4"
                  onChange={(e) => setStationL(e.target.value)}
                  value={stationL}
                />
              </div>
              <div className="px-4 py-2 mt-4 w-full max-w-md">
                <Label
                  htmlFor="batchNr"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Batch Number
                </Label>
                <Input
                  name="batchNr"
                  type="text"
                  placeholder="Enter Batch Number"
                  className="bg-white dark:bg-gray-700 mt-4"
                  onChange={(e) => setBatchNr(e.target.value)}
                  value={batchNr}
                />
              </div>
            </>
          ) : (
            <div className="px-4 py-2 mt-4 w-full max-w-md">
              <Label
                htmlFor="accessibleReason"
                className="text-gray-600 dark:text-gray-400"
              >
                Reason Not Accessible
              </Label>
              <textarea
                name="accessibleReason"
                className="bg-white dark:bg-gray-700 mt-4 w-full rounded border border-gray-300 dark:border-gray-700 p-2 min-h-[80px]"
                placeholder="Enter reason..."
                value={accessible_reason}
                onChange={(e) => setAccessibleReason(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter className="px-4 pb-4">
          {loading ? (
            <Button disabled>Loading...</Button>
          ) : (
            <Button
              onClick={() =>
                saveStation(
                  stationNr,
                  station_activity,
                  is_outside,
                  remark,
                  poisonType,
                  stationL,
                  batchNr
                )
              }
            >
              Save
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStation;
