import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RoomsSection from './components/RoomsSection';
import MaterialsSettings from './components/MaterialsSettings';
import PricesSettings from './components/PricesSettings';
import WasteSettings from './components/WasteSettings';
import EconomicsSettings from './components/EconomicsSettings';
import ActionsSection from './components/ActionsSection';
import ResultsSection from './components/ResultsSection';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [boardLength, setBoardLength] = useState(3);
  const [studSpacing, setStudSpacing] = useState(0.6);
  const [structureType, setStructureType] = useState('single');
  const [prices, setPrices] = useState({
    gypsum: 3.5,
    c: 2.8,
    u: 2,
    corner: 1.5,
    insulation: 5,
    screws: 15,
    tape: 4,
    putty: 8,
    hanger: 3,
  });
  const [waste, setWaste] = useState({
    gypsumWaste: 5,
    cWaste: 5,
    uWaste: 5,
    cornerWaste: 5,
    insulationWaste: 5,
  });
  const [vatRate, setVatRate] = useState(24);
  const [profitMargin, setProfitMargin] = useState(10);
  const [labourCost, setLabourCost] = useState(15);
  const [results, setResults] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
      document.body.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow max-w-5xl mx-auto p-4 space-y-6">
        <h2 className="text-2xl font-semibold">Υπολογιστής Υλικών Γυψοσανίδας</h2>
        <RoomsSection rooms={rooms} setRooms={setRooms} />
        <MaterialsSettings
          boardLength={boardLength}
          setBoardLength={setBoardLength}
          studSpacing={studSpacing}
          setStudSpacing={setStudSpacing}
          structureType={structureType}
          setStructureType={setStructureType}
        />
        <PricesSettings prices={prices} setPrices={setPrices} />
        <WasteSettings waste={waste} setWaste={setWaste} />
        <EconomicsSettings
          vatRate={vatRate}
          setVatRate={setVatRate}
          profitMargin={profitMargin}
          setProfitMargin={setProfitMargin}
          labourCost={labourCost}
          setLabourCost={setLabourCost}
        />
        <ActionsSection
          rooms={rooms}
          boardLength={boardLength}
          studSpacing={studSpacing}
          structureType={structureType}
          prices={prices}
          waste={waste}
          vatRate={vatRate}
          profitMargin={profitMargin}
          labourCost={labourCost}
          setResults={setResults}
        />
        <ResultsSection results={results} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
"Add App.tsx"
