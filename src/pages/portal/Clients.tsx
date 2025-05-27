import { useState, useEffect, useCallback, useRef } from "react";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ClientProps {
  client_id: string;
  client_name: string;
  client_email: string;
  client_cell: string;
  client_address: string;
  created: string;
}

interface APIResponse {
  success: boolean;
  data: ClientProps[];
  error?: string;
}

const Clients = () => {
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const getClients = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const response = await fetch("/portal_api/get_clients.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: 15, offset: page * 15 }),
      });

      if (!response.ok) {
        toast("Failed to fetch clients");
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        const result: APIResponse = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setClients((prev) => {
            const existingIds = new Set(prev.map((c) => c.client_id));
            const newUniqueClients = result.data.filter(
              (client) => !existingIds.has(client.client_id)
            );
            return [...prev, ...newUniqueClients];
          });

          if (result.data.length < 15) {
            setHasMore(false);
          }
        } else {
          toast(result.error || "Unexpected API response format.");
        }
      } else {
        toast("Invalid response type.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast("Error loading clients");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]); // ✅ No `clients` here

  useEffect(() => {
    getClients();
  }, [page, getClients]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="bg-white dark:bg-gray-800 h-full">
      {loading && clients.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <LoaderCircle className="w-12 h-12 mb-4 animate-spin" />
          <p className="text-lg">Loading, Please wait...</p>
        </div>
      )}

      {loading && clients.length !== 0 && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white border border-gray-200 shadow-md rounded-full px-4 py-2">
          <LoaderCircle className="w-5 h-5 text-gray-600 animate-spin mr-2" />
          <span className="text-sm text-gray-700">Loading...</span>
        </div>
      )}

      {clients.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg">No Clients Found</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 h-full overflow-y-auto">
          {clients.map((client: ClientProps) => (
            <li key={client.client_id} className="flex items-center p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                {client.client_name.toString().slice(0, 1)}
              </div>
              <div className="flex-1 ml-4">
                <p className="text-gray-800 dark:text-white">
                  {client.client_name}
                </p>
                <p className="text-sm text-gray-500">
                  Address: {client.client_address}
                </p>
                <p className="text-sm text-gray-500">
                  {client.client_email} • {client.client_cell}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Since: {client.created}
                </p>
              </div>
            </li>
          ))}
          <div ref={lastElementRef} className="h-10" />
        </ul>
      )}
    </div>
  );
};

export default Clients;
