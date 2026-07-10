import { BrowserRouter, Routes } from "react-router-dom";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes";

const App = () => (
  <AppProviders>
    <BrowserRouter basename="/admin">
      <Routes>
        {AppRoutes}
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;
