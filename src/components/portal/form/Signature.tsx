import ReactSignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SignatureProps {
  setCounter: () => void;
  prevStep: () => void;
  reportID: string;
}

interface SaveSignatureResponse {
  success: boolean;
  error?: string;
}

const ClientSignature: React.FC<SignatureProps> = ({
  setCounter,
  prevStep,
  reportID,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const sigCanvasRef = useRef<ReactSignatureCanvas | null>(null);

  const handleClear = (): void => {
    sigCanvasRef.current?.clear();
  };

  const handleSave = async (): Promise<void> => {
    const canvas = sigCanvasRef.current;

    if (!canvas || canvas.isEmpty()) {
      toast("Please provide a signature before saving.");
      return;
    }

    setLoading(true);

    try {
      const dataUrl: string = canvas.getCanvas().toDataURL("image/png");
      const base64Data: string = dataUrl.split(",")[1];

      const response: Response = await fetch("/portal_api/save_signature.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_id: reportID,
          signature: base64Data,
        }),
      });

      const contentType: string | null = response.headers.get("Content-Type");

      if (!response.ok) {
        const message: string = await response.text();
        setLoading(false);
        throw new Error(message);
      }

      if (contentType?.includes("application/json")) {
        const result: SaveSignatureResponse = await response.json();
        if (result.success) {
          setCounter();
        } else {
          toast("Error saving signature. Please try again");
        }
      } else {
        toast("Unexpected response format from server.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error saving signature:", err.message);
        toast(err.message);
      } else {
        console.error("Unknown error saving signature:", err);
        toast("Failed to save signature. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full h-full py-12">
      {loading && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white border border-gray-200 shadow-md rounded-full px-4 py-2">
          <LoaderCircle className="w-5 h-5 text-gray-600 animate-spin mr-2" />
          <span className="text-sm text-gray-700">Loading...</span>
        </div>
      )}
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="px-4 py-2 w-full max-w-md">
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

        <div className="flex flex-col items-center justify-center mt-8">
          <h1 className="text-xl font-bold flex items-center justify-center gap-2 mb-4">
            <LoaderCircle
              className={`animate-spin ${
                loading ? "opacity-100" : "opacity-0"
              }`}
            />
            Client Signature
          </h1>
        </div>

        <div className="px-4 py-2 mt-4 w-full max-w-md">
          <p>
            I, the undersigned, confirm that the pest control service was
            rendered by KPS Pest Control on my premises...
          </p>
        </div>

        <div className="px-4 py-2 mt-4 w-full max-w-md">
          <ReactSignatureCanvas
            ref={sigCanvasRef}
            canvasProps={{
              className:
                "border-2 border-gray-300 dark:border-gray-600 rounded-lg w-full h-48",
            }}
          />
        </div>

        <div className="px-4 py-2 mt-4 w-full max-w-md">
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full mt-4"
          >
            Clear
          </Button>
          <Button onClick={handleSave} className="w-full mt-4">
            Save <Save />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientSignature;
