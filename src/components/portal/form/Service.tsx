import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialAreas = {
  area_kitchen: false,
  area_zink: false,
  area_bakery: false,
  area_deli: false,
  area_backdoor: false,
  area_front_desk: false,
  area_store: false,
  area_office: false,
  area_lockers: false,
  area_rubish: false,
  area_other: "",
};
const initialFor = {
  for_cockroaches: false,
  for_fleas: false,
  for_lice: false,
  for_ants: false,
  for_rodents: false,
  for_flies: false,
  for_fishmoths: false,
  for_bedbugs: false,
  for_termites: false,
  for_crickets: false,
  for_other: "",
};
const initialWith = {
  with_alphathrin: "",
  with_roach_force: "",
  with_flushing_agent: "",
  with_bandit: "",
  with_fly_bait: "",
  other: "",
  other_l_number: "",
  other_batch_no: "",
  remarks: "",
};

interface ServiceProps {
  setCounter: () => void;
  prevStep: () => void;
  reportID: string;
}

const Service: React.FC<ServiceProps> = ({
  reportID,
  setCounter,
  prevStep,
}) => {
  const [areas, setAreas] = useState(initialAreas);
  const [forPest, setForPest] = useState(initialFor);
  const [withChem, setWithChem] = useState(initialWith);
  const [loading, setLoading] = useState(false);

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAreas((prev) => ({ ...prev, [name]: checked }));
  };
  const handleForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForPest((prev) => ({ ...prev, [name]: checked }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWithChem((prev) => ({ ...prev, [name]: value }));
  };
  const handleOtherArea = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreas((prev) => ({ ...prev, area_other: e.target.value }));
  };
  const handleOtherFor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForPest((prev) => ({ ...prev, for_other: e.target.value }));
  };

  const saveService = async () => {
    setLoading(true);
    try {
      const response = await fetch("/portal_api/save_service.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportID,
          ...Object.fromEntries(
            Object.entries(areas).map(([k, v]) => [
              k,
              typeof v === "boolean" ? Number(v) : v,
            ])
          ),
          ...Object.fromEntries(
            Object.entries(forPest).map(([k, v]) => [
              k,
              typeof v === "boolean" ? Number(v) : v,
            ])
          ),
          ...withChem,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast("Service data saved successfully.");
        setAreas(initialAreas);
        setForPest(initialFor);
        setWithChem(initialWith);
        setCounter();
      } else {
        toast(data.error || "Error saving service data.");
      }
    } catch {
      toast("Error saving service data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevStep}
          className="flex items-center gap-1"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <form
        className="max-w-xl mx-auto p-6 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveService();
        }}
      >
        <div>
          <h2 className="text-lg mb-2 text-primary">Treated Area</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(initialAreas).map(([key]) =>
              key !== "area_other" ? (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={key}
                    checked={areas[key as keyof typeof areas] as boolean}
                    onChange={handleAreaChange}
                    className="accent-primary"
                  />
                  {key
                    .replace("area_", "")
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
              ) : null
            )}
            <Label htmlFor="area_other">Other Area</Label>
            <Input
              name="area_other"
              value={areas.area_other}
              onChange={handleOtherArea}
              placeholder="Other area"
              className="col-span-2"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg mb-2 text-primary">Treated For</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(initialFor).map(([key]) =>
              key !== "for_other" ? (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={key}
                    checked={forPest[key as keyof typeof forPest] as boolean}
                    onChange={handleForChange}
                    className="accent-primary"
                  />
                  {key
                    .replace("for_", "")
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
              ) : null
            )}
            <Label htmlFor="for_other">Other Pest</Label>
            <Input
              name="for_other"
              value={forPest.for_other}
              onChange={handleOtherFor}
              placeholder="Other pest"
              className="col-span-2"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg mb-2 text-primary">Treated With</h2>
          <div className="grid grid-cols-2 gap-2">
            <Label htmlFor="with_alphathrin">Alphathrin (L 7850)</Label>
            <Input
              name="with_alphathrin"
              value={withChem.with_alphathrin}
              onChange={handleInputChange}
              placeholder="Batch No"
              type="number"
            />
            <Label htmlFor="with_roach_force">Roach Force (L 8652)</Label>
            <Input
              name="with_roach_force"
              value={withChem.with_roach_force}
              onChange={handleInputChange}
              placeholder="Batch No"
              type="number"
            />
            <Label htmlFor="with_flushing_agent">Flushing Agent (L 4970)</Label>
            <Input
              name="with_flushing_agent"
              value={withChem.with_flushing_agent}
              onChange={handleInputChange}
              placeholder="Batch No"
              type="number"
            />
            <Label htmlFor="with_bandit">Bandit 350, SC (L 8001)</Label>
            <Input
              name="with_bandit"
              value={withChem.with_bandit}
              onChange={handleInputChange}
              placeholder="Batch No"
              type="number"
            />
            <Label htmlFor="with_fly_bait">Fly Bait (L 7579)</Label>
            <Input
              name="with_fly_bait"
              value={withChem.with_fly_bait}
              onChange={handleInputChange}
              placeholder="Batch No"
              type="number"
            />
            <Label htmlFor="other">Other</Label>
            <Input
              name="other"
              value={withChem.other}
              onChange={handleInputChange}
              placeholder="Other"
            />
            {withChem.other && (
              <>
                <Label htmlFor="other_l_number">L Number (Other)</Label>
                <Input
                  name="other_l_number"
                  value={withChem.other_l_number}
                  onChange={handleInputChange}
                  placeholder="L Number (Other)"
                  type="number"
                />
                <Label htmlFor="other_batch_no">Batch No (Other)</Label>
                <Input
                  name="other_batch_no"
                  value={withChem.other_batch_no}
                  onChange={handleInputChange}
                  placeholder="Batch No (Other)"
                  type="number"
                />
              </>
            )}
            <Label htmlFor="remarks" className="col-span-2">
              Remarks
            </Label>
            <textarea
              name="remarks"
              value={withChem.remarks}
              onChange={(e) =>
                setWithChem((prev) => ({ ...prev, remarks: e.target.value }))
              }
              placeholder="Remarks"
              className="col-span-2 min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default Service;
