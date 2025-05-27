import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlignJustify,
  GalleryVerticalEnd,
  SquarePen,
  User,
  Download,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  isSelected: string;
  handleSelect: (path: string) => void;
  isSearchShow: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const menuItems = [
  { label: "Form", icon: "SquarePen", path: "/portal/form" },
  { label: "Reports", icon: "GalleryVerticalEnd", path: "/portal/report" },
  { label: "Clients", icon: "user", path: "/portal/client" },
];

const TopNav: React.FC<TopNavProps> = ({
  isSelected,
  handleSelect,
  isSearchShow,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : false;
  });

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installDialogOpen, setInstallDialogOpen] = useState(false);
  useEffect(() => {
    // Check if the device is iOS
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    setIsIOS(checkIsIOS());

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Set dark mode class on initial load
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update localStorage and html class when dark mode changes
    localStorage.setItem("darkMode", isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  const handleInstallClick = async () => {
    if (isIOS) {
      setInstallDialogOpen(true);
    } else if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      await deferredPrompt.userChoice;

      // Clear the saved prompt
      setDeferredPrompt(null);
    }
  };

  const showInstallButton = isIOS || deferredPrompt !== null;

  return (
    <div className="border-b border-b-gray-200 dark:border-b-gray-700 h-[8dvh] px-4 w-svw z-10 py-2 flex items-center justify-between bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {isDarkMode ? (
        <img src="/logo2.png" className="h-[80%]" alt="KPS Logo Dark" />
      ) : (
        <img src="/logo.png" className="h-[80%]" alt="KPS Logo" />
      )}

      <div className="flex items-center gap-2">
        {/* Search Button */}
        {isSearchShow && (
          <span className="w-10 h-10 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer">
            <Search />
          </span>
        )}

        {/* Menu Button */}
        <Sheet>
          <SheetTrigger>
            <span className="w-10 h-10 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer">
              <AlignJustify />
            </span>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>KPS</SheetTitle>
              <SheetDescription>
                <ul className="w-full overflow-hidden mt-20">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => handleSelect(item.path)}
                        className={`flex gap-2 py-2 px-4 items-center transition ${
                          isSelected === item.path
                            ? "text-black border-r-2 dark:text-white border-black dark:border-white"
                            : "text-gray-500 border-r-2 border-gray-100 dark:border-gray-800"
                        }`}
                      >
                        {item.icon === "SquarePen" && <SquarePen />}
                        {item.icon === "GalleryVerticalEnd" && (
                          <GalleryVerticalEnd />
                        )}
                        {item.icon === "user" && <User />}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col mt-10 gap-4 items-center">
                  <Button
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
                  >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </Button>

                  {showInstallButton && (
                    <Button
                      onClick={handleInstallClick}
                      className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Install App
                    </Button>
                  )}
                </div>

                <span className="absolute bottom-10 left-0 right-0 text-center text-gray-500">
                  <Link
                    to="https://dannel.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Powered by Dannel Web Design
                  </Link>
                </span>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        {/* iOS Installation Instructions Dialog */}
        <Dialog open={installDialogOpen} onOpenChange={setInstallDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Install on iOS</DialogTitle>
              <DialogDescription>
                Follow these steps to add KPS to your home screen:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-center">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 flex-shrink-0">
                  <span className="text-lg font-bold">1</span>
                </div>
                <p>Tap the Share button at the bottom of the screen</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 flex-shrink-0">
                  <span className="text-lg font-bold">2</span>
                </div>
                <p>Scroll down and tap "Add to Home Screen"</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 flex-shrink-0">
                  <span className="text-lg font-bold">3</span>
                </div>
                <p>Tap "Add" in the top right corner</p>
              </div>
              <button
                onClick={() => setInstallDialogOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md w-full"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TopNav;
