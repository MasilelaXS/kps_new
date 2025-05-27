import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { AlertCircle, Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Report {
  report_id: number;
  user_id: number;
  client_id: number;
  client_name: string;
  report_status: string;
  report_date: string;
}

interface APIResponse {
  success: boolean;
  data: Report[];
  error?: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const getReports = useCallback(async (): Promise<void> => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const response = await fetch("/portal_api/get_reports.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 15,
          offset: page * 15,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch reports:", errorText);
        toast("Error fetching reports.");
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        const result: APIResponse = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setReports((prev) => {
            const existingIds = new Set(prev.map((r) => r.report_id));
            const newReports = result.data.filter(
              (r) => !existingIds.has(r.report_id)
            );
            return [...prev, ...newReports];
          });

          if (result.data.length < 15) setHasMore(false);
        } else {
          console.error("Unexpected response format.", result.error);
          toast("Error fetching reports.");
        }
      } else {
        const rawResponse = await response.text();
        console.error("Unexpected response format:", rawResponse);
        toast("Error fetching reports.");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast("Error fetching reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]); // ✅ removed `reports` to avoid stale state

  useEffect(() => {
    getReports();
  }, [page, getReports]);

  // Use ref callback to avoid stale ref issues
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDownload = async (reportId: number): Promise<void> => {
    try {
      const response = await fetch("/portal_api/download_report.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report_id: reportId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to download report:", errorText);
        toast("Error downloading report.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast("Report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast("Error downloading report. Please try again.");
    }
  };

  return (
    <div className="py-4 h-full no-scrollbar bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
      {loading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <LoaderCircle className="w-12 h-12 mb-4 animate-spin" />
          <p className="text-lg">Loading, Please wait...</p>
        </div>
      )}

      {loading && reports.length !== 0 && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white border border-gray-200 shadow-md rounded-full px-4 py-2">
          <LoaderCircle className="w-5 h-5 text-gray-600 animate-spin mr-2" />
          <span className="text-sm text-gray-700">Loading...</span>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg">No Reports Found</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 h-full overflow-y-auto">
          {reports.map((report) => (
            <li key={report.report_id} className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                {report.client_name.toString().slice(0, 1)}
              </div>
              <div className="flex-1 ml-4">
                <p className="text-gray-800 dark:text-white">
                  Report ID: {report.report_id}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {report.report_status}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {report.report_date}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Client: {report.client_name}
                </p>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-200">
                <Button
                  onClick={() => handleDownload(report.report_id)}
                  variant="outline"
                  className=""
                >
                  Download <Download className="" />
                </Button>
              </div>
            </li>
          ))}
          <div ref={lastElementRef} className="h-10"></div>
        </ul>
      )}
    </div>
  );
};

export default Reports;
