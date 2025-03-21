import { useState } from 'react';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';

interface ActionsSectionProps {
  rooms: any[];
  boardLength: number;
  studSpacing: number;
  structureType: string;
  prices: any;
  waste: any;
  vatRate: number;
  profitMargin: number;
  labourCost: number;
  setResults: (result: string) => void;
}

const ActionsSection = ({
  rooms,
  boardLength,
  studSpacing,
  structureType,
  prices,
  waste,
  vatRate,
  profitMargin,
  labourCost,
  setResults
}: ActionsSectionProps) => {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  const calculate = () => {
    if (!rooms.length) {
      alert('Πρέπει να προσθέσετε χώρους!');
      return;
    }

    const totalArea = rooms.reduce((sum, r) => sum + r.netArea, 0);

    let skeletonFactor = 1;
    if (structureType === 'double') skeletonFactor = 1.5;
    if (structureType === 'heavy') skeletonFactor = 2;

    const gypsumBoards = (totalArea / (1.2 * boardLength)) * (1 + waste.gypsumWaste / 100);
    const cProfiles = (totalArea / boardLength) * (1 / studSpacing) * boardLength * skeletonFactor * (1 + waste.cWaste / 100);
    const uProfiles = (totalArea / boardLength) * 2 * boardLength * (1 + waste.uWaste / 100);
    const cornerBeads = totalArea * 0.8 * (1 + waste.cornerWaste / 100);
    const insulation = totalArea * (1 + waste.insulationWaste / 100);
    const screws = totalArea * 25 * skeletonFactor;
    const tapeRolls = (totalArea * 1.2) / 90;
    const puttySacks = (totalArea * 0.35) / 28;
    const hangers = rooms.filter(r => r.type === 'ceiling').reduce((sum, r) => sum + (r.netArea * 0.8), 0);

    const materialsCost =
      gypsumBoards * prices.gypsum +
      cProfiles * prices.c +
      uProfiles * prices.u +
      cornerBeads * prices.corner +
      insulation * prices.insulation +
      (screws / 1000) * prices.screws +
      tapeRolls * prices.tape +
      puttySacks * prices.putty +
      hangers * prices.hanger;

    const labour = totalArea * labourCost;
    const subtotal = materialsCost + labour;
    const profit = subtotal * (profitMargin / 100);
    const vat = (subtotal + profit) * (vatRate / 100);
    const total = subtotal + profit + vat;

    const resultText = `
Συνολικό Εμβαδόν: ${totalArea.toFixed(2)} m²
Γυψοσανίδες: ${gypsumBoards.toFixed(2)} τεμ
Προφίλ C: ${cProfiles.toFixed(2)} m
Προφίλ U: ${uProfiles.toFixed(2)} m
Γωνιόκρανα: ${cornerBeads.toFixed(2)} m
Μονωτικό: ${insulation.toFixed(2)} m²
Βίδες: ${screws.toFixed(0)} τμχ
Ταινία: ${tapeRolls.toFixed(2)} ρολά
Στόκος: ${puttySacks.toFixed(2)} σακιά
Αναρτήσεις: ${hangers.toFixed(0)} τεμ

Κόστος Υλικών: ${materialsCost.toFixed(2)} €
Εργατικά: ${labour.toFixed(2)} €
Κέρδος: ${profit.toFixed(2)} €
ΦΠΑ: ${vat.toFixed(2)} €
Συνολικό Κόστος: ${total.toFixed(2)} €
`;

    setResults(resultText);
    drawChart(materialsCost, labour, profit, vat);
  };

  const drawChart = (materials: number, labour: number, profit: number, vat: number) => {
    const ctx = (document.getElementById('costChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    if (chartInstance) chartInstance.destroy();

    const newChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Υλικά', 'Εργατικά', 'Κέρδος', 'ΦΠΑ'],
        datasets: [{
          data: [materials, labour, profit, vat],
          backgroundColor: ['#d4af37', '#333', '#888', '#555']
        }]
      },
      options: { responsive: true }
    });

    setChartInstance(newChart);
  };

  const exportTxt = (results: string) => {
    const blob = new Blob([results], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Υπολογισμός_Γυψοσανίδας.txt';
    link.click();
  };

  const exportCsv = (results: string) => {
    const csv = results.replace(/\n/g, ',');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Υπολογισμός_Γυψοσανίδας.csv';
    link.click();
  };

  const exportPdf = (results: string) => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(results, 180);
    doc.text(lines, 10, 10);
    doc.save('Υπολογισμός_Γυψοσανίδας.pdf');
  };

  const printResults = (results: string) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<pre>' + results + '</pre>');
    printWindow?.document.close();
    printWindow?.print();
  };

  const clearAll = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-6">
      <button onClick={calculate} className="btn-primary">Υπολογισμός</button>
      <button onClick={() => exportTxt(document.getElementById('results')?.textContent || '')} className="btn-secondary">TXT</button>
      <button onClick={() => exportCsv(document.getElementById('results')?.textContent || '')} className="btn-secondary">CSV</button>
      <button onClick={() => exportPdf(document.getElementById('results')?.textContent || '')} className="btn-secondary">PDF</button>
      <button onClick={() => printResults(document.getElementById('results')?.textContent || '')} className="btn-secondary">Εκτύπωση</button>
      <button onClick={clearAll} className="btn-danger">Καθαρισμός</button>
      <canvas id="costChart" height="100" className="mt-6"></canvas>
    </div>
  );
};

export default ActionsSection;
"Add App.tsx"
