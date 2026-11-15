const tariffs = {
  national: { label: "India average", fixed: 70, tax: 0.05, slabs: [[100, 3.5], [200, 5.5], [300, 7], [Infinity, 8.5]] },
  delhi: { label: "Delhi", fixed: 65, tax: 0.05, slabs: [[200, 3], [200, 4.5], [400, 6.5], [Infinity, 8] ] },
  maharashtra: { label: "Maharashtra", fixed: 95, tax: 0.08, slabs: [[100, 4.2], [200, 7], [300, 9], [Infinity, 10.5]] },
  karnataka: { label: "Karnataka", fixed: 80, tax: 0.06, slabs: [[100, 4], [200, 6], [300, 7.5], [Infinity, 9]] },
  "uttar-pradesh": { label: "Uttar Pradesh", fixed: 90, tax: 0.05, slabs: [[100, 3.5], [200, 5.5], [300, 7], [Infinity, 8.5]] },
  rajasthan: { label: "Rajasthan", fixed: 100, tax: 0.06, slabs: [[100, 4.5], [200, 6.5], [300, 8], [Infinity, 9.5]] },
  "tamil-nadu": { label: "Tamil Nadu", fixed: 75, tax: 0.05, slabs: [[100, 0], [100, 2.25], [300, 4.5], [Infinity, 7.5]] }
};

const form = document.querySelector("#bill-form");
const result = document.querySelector("#result");
const unitsInput = document.querySelector("#units");
const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function calculateEnergy(units, slabs) {
  let remaining = units;
  let previousLimit = 0;
  let total = 0;
  for (const [limit, rate] of slabs) {
    const slabUnits = Math.min(remaining, limit - previousLimit);
    total += slabUnits * rate;
    remaining -= slabUnits;
    previousLimit = limit;
    if (remaining <= 0) break;
  }
  return total;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const units = Number(unitsInput.value);
  if (!Number.isFinite(units) || units < 0 || units > 100000) {
    unitsInput.setCustomValidity("0 se 100,000 ke beech units enter karein.");
    unitsInput.reportValidity();
    return;
  }
  unitsInput.setCustomValidity("");
  const tariff = tariffs[document.querySelector("#state").value] || tariffs.national;
  const energy = calculateEnergy(units, tariff.slabs);
  const tax = energy * tariff.tax;
  const extras = tariff.fixed + tax;
  const total = Math.round(energy + extras);

  document.querySelector("#amount").textContent = money.format(total);
  document.querySelector("#result-units").textContent = `${money.format(units)} kWh · ${tariff.label}`;
  document.querySelector("#energy-charge").textContent = `₹${money.format(energy)}`;
  document.querySelector("#extra-charge").textContent = `₹${money.format(extras)}`;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

unitsInput.addEventListener("input", () => unitsInput.setCustomValidity(""));
