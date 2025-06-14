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
    // Initialize dark mode from localStorage
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

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

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
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
    <div className="safe-area-top border-b native-divider h-16 px-4 w-full z-10 py-2 flex items-center justify-between bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 relative">
      {/* Status bar overlay for iOS */}
      <div className="absolute top-0 left-0 right-0 h-6 status-bar-overlay pointer-events-none" />
      
      {isDarkMode ? (
        <img src="/logo2.png" className="h-8 w-auto" alt="KPS Logo Dark" />
      ) : (
        <img src="/logo.png" className="h-8 w-auto" alt="KPS Logo" />
      )}

      <div className="flex items-center gap-1">
        {/* Search Button */}
        {isSearchShow && (
          <button className="w-11 h-11 flex items-center justify-center rounded-xl native-button haptic-feedback bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Search size={20} strokeWidth={2} />
          </button>
        )}

        {/* Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-11 h-11 flex items-center justify-center rounded-xl native-button haptic-feedback bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <AlignJustify size={20} strokeWidth={2} />
            </button>
          </SheetTrigger>
          <SheetContent className="w-80 bg-white dark:bg-gray-900 border-l native-divider">
            <SheetHeader className="text-left pb-6">
              <SheetTitle className="text-xl font-semibold">KPS</SheetTitle>
              <SheetDescription className="text-gray-500 dark:text-gray-400">
                Kingsway Pest Services
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex flex-col h-full">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => handleSelect(item.path)}
                      className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 native-button ${
                        isSelected === item.path
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isSelected === item.path 
                          ? "bg-blue-100 dark:bg-blue-800/30" 
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        {item.icon === "SquarePen" && <SquarePen size={18} strokeWidth={2} />}
                        {item.icon === "GalleryVerticalEnd" && <GalleryVerticalEnd size={18} strokeWidth={2} />}
                        {item.icon === "user" && <User size={18} strokeWidth={2} />}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3 pt-6 border-t native-divider">
                <Button
                  onClick={toggleDarkMode}
                  className="w-full justify-start gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl native-button border-0"
                >
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                    {isDarkMode ? "☀️" : "🌙"}
                  </div>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </Button>

                {showInstallButton && (
                  <Button
                    onClick={handleInstallClick}
                    className="w-full justify-start gap-3 py-3 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30 rounded-xl native-button border-0"
                  >
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/30">
                      <Download size={18} strokeWidth={2} />
                    </div>
                    Install App
                  </Button>
                )}
                
                <div className="pt-4 text-center">
                  <Link
                    to="https://dannel.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    Powered by Dannel Web Design
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* iOS Installation Instructions Dialog */}
        <Dialog open={installDialogOpen} onOpenChange={setInstallDialogOpen}>
          <DialogContent className="sm:max-w-md native-card">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-semibold">Install on iOS</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                Add KPS to your home screen for quick access
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700 dark:text-gray-300">Tap the Share button at the bottom of Safari</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700 dark:text-gray-300">Scroll down and tap "Add to Home Screen"</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700 dark:text-gray-300">Tap "Add" in the top right corner</p>
              </div>
              
              <Button
                onClick={() => setInstallDialogOpen(false)}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl native-button"
              >
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TopNav;
