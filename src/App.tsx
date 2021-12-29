import { RoutesApp } from "routes";
import { AuthProvider } from "contexts/AuthContext";
import "styles/global.scss";

function App() {
  return (
    <AuthProvider>
      <RoutesApp />
    </AuthProvider>
  );
}

export default App;
