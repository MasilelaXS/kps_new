import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialRodent = {
  replaced_rodentbox: false,
  replaced_warning_sign: false,
  replaced_insect: false,
  attention: "",
};

interface RodentProps {
  setCounter: () => void;
  prevStep: () => void;
  reportID: string;
}

const Rodent: React.FC<RodentProps> = ({ reportID, setCounter, prevStep }) => {
  const [rodent, setRodent] = useState(initialRodent);
  const [loading, setLoading] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setRodent((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setRodent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const saveRodent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/portal_api/save_rodent.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportID,
          ...rodent,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast("Rodent data saved successfully.");
        setRodent(initialRodent);
        setCounter();
      } else {
        toast(data.error || "Error saving rodent data.");
      }
    } catch {
      toast("Error saving rodent data. Please try again.");
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
          saveRodent();
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="replaced_rodentbox">Replaced Rodent Box</Label>
          <input
            type="checkbox"
            name="replaced_rodentbox"
            checked={rodent.replaced_rodentbox}
            onChange={handleInput}
            className="accent-primary h-5 w-5 mt-1"
          />
          <Label htmlFor="replaced_warning_sign">Replaced Warning Sign</Label>
          <input
            type="checkbox"
            name="replaced_warning_sign"
            checked={rodent.replaced_warning_sign}
            onChange={handleInput}
            className="accent-primary h-5 w-5 mt-1"
          />
          <Label htmlFor="replaced_insect">Replaced Insect Monitor</Label>
          <input
            type="checkbox"
            name="replaced_insect"
            checked={rodent.replaced_insect}
            onChange={handleInput}
            className="accent-primary h-5 w-5 mt-1"
          />
          <Label htmlFor="attention" className="col-span-2 mt-10">
            Attention must be given
          </Label>
          <textarea
            name="attention"
            value={rodent.attention}
            onChange={handleInput}
            placeholder="Attention notes"
            className="col-span-2 min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          />
        </div>
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default Rodent;
