import { useEffect, useState } from "react";
import AddStation from "./AddStation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StationsProps {
  id: number;
  station_no: number;
  is_accessible: boolean;
  accessible_reason: string;
  station_activity: number;
  is_outside: boolean;
  station_remark: string;
  station_poison_type: string;
  other: string;
  poison: string;
  poison_qty: number;
  qty_unit: string;
  station_l_no: string;
  station_batch_no: string;
}

interface StationProps {
  setCounter: () => void;
  prevStep: () => void;
  reportID: string;
}

const Stations: React.FC<StationProps> = ({
  reportID,
  setCounter,
  prevStep,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [Stations, setStations] = useState<StationsProps[]>();
  const [activeTab, setActiveTab] = useState<string>("inside");

  const getStations = async (reportID: string): Promise<void> => {
    setLoading(true);
    try {
      const response: Response = await fetch(`/portal_api/get_stations.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_id: reportID,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch stations:", errorText);
        toast("Error fetching stations.");
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setStations(result.data);
        } else {
          console.error(
            "Unexpected response format. Expected an array under 'data'."
          );
          toast("Error fetching stations.");
        }
      } else {
        console.error("Unexpected response format. Expected JSON.");
        toast("Error fetching stations.");
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      toast("Error fetching stations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStation = async (id: number): Promise<void> => {
    if (loading) return; // Prevent multiple clicks while loading
    setLoading(true);
    try {
      const response: Response = await fetch("/portal_api/delete_station.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete station:", errorText);
        toast("Error deleting station data.");
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.success) {
          toast("Station data deleted successfully.");

          // Fetch and update stations
          await getStations(reportID);
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

  // Filter stations by inside/outside
  const insideStations =
    Stations?.filter((station) => !station.is_outside) || [];
  const outsideStations =
    Stations?.filter((station) => station.is_outside) || [];

  // Count stations
  const insideCount = insideStations?.length || 0;
  const outsideCount = outsideStations?.length || 0;

  useEffect(() => {
    getStations(reportID);
  }, [reportID]);

  // Render station card
  const renderStationCard = (station: StationsProps) => (
    <div
      key={station.id}
      className="bg-white dark:bg-gray-900 rounded-lg p-3 flex flex-col gap-2 border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-primary text-base tracking-wide">
          Station {station.station_no}
        </span>
        <span className="text-xs text-gray-400">
          {station.is_accessible
            ? `Batch: ${station.station_batch_no}`
            : "Station not accessible"}
        </span>
      </div>
      {station.is_accessible ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-300">Activity:</span>{" "}
            {station.station_activity ? "Yes" : "No"}
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-300">Poison:</span>{" "}
            {station.poison || "N/A"}
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-300">Remark:</span>{" "}
            {station.station_remark || "N/A"}
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-300">QTY:</span>{" "}
            {station.poison_qty && station.qty_unit
              ? `${station.poison_qty} ${station.qty_unit}`
              : "N/A"}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          {station.accessible_reason || "No reason provided"}
        </div>
      )}
      <button
        className="self-end mt-2 text-xs text-red-500 hover:underline hover:text-red-600 transition-colors"
        onClick={() => station.id && deleteStation(station.id)}
        type="button"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevStep}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-2 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="inside" className="flex-1">
              Inside ({insideCount})
            </TabsTrigger>
            <TabsTrigger value="outside" className="flex-1">
              Outside ({outsideCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inside" className="flex-1 overflow-y-auto p-2">
          {insideCount === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-400">
              No inside stations
            </div>
          ) : (
            <div className="space-y-3">
              {insideStations.map(renderStationCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outside" className="flex-1 overflow-y-auto p-2">
          {outsideCount === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-400">
              No outside stations
            </div>
          ) : (
            <div className="space-y-3">
              {outsideStations.map(renderStationCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <Button
        onClick={() => setCounter()}
        className="absolute bottom-8 right-25 z-20"
      >
        Next
      </Button>
      <AddStation reportID={reportID} getStations={getStations} />
    </div>
  );
};

export default Stations;
