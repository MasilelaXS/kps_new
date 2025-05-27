import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PortalLayout from "./pages/portal/PortalLayout";
import Form from "./pages/portal/Form";
import Reports from "./pages/portal/Reports";
import Clients from "./pages/portal/Clients";
import { default as DeskReport } from "./pages/admin/Reports";
import { default as DeskClients } from "./pages/admin/Clients";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./pages/admin/AdminLayout";

function App() {
  // Check if device is desktop based on window width
  const isDesktop = window.innerWidth >= 1024; // Common breakpoint for desktop

  return (
    <Router>
      {isDesktop ? (
        <Routes>
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<DeskReport />} />
            <Route path="client" element={<DeskClients />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route index element={<Navigate to="/portal" replace />} />
          <Route path="/" element={<Navigate to="/portal" replace />} />
          <Route path="/portal/*" element={<PortalLayout />}>
            <Route index element={<Form />} />
            <Route path="form" element={<Form />} />
            <Route path="report" element={<Reports />} />
            <Route path="client" element={<Clients />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}

export default App;
