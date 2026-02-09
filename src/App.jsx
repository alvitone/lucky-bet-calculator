import { Routes, Route } from "react-router-dom";
import LuckySelect from "../pages/LuckySelect/LuckySelect";
import Calculator from "../pages/Calculator/Calculator";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LuckySelect />} />
      <Route path="/calculator/:count" element={<Calculator />} />
    </Routes>
  );
}

export default App;
