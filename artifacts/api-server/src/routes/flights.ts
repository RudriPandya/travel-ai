import { Router } from "express";

const router = Router();

const AIRLINES = [
  { code: "UA", name: "United Airlines", logo: "UA" },
  { code: "DL", name: "Delta Air Lines", logo: "DL" },
  { code: "AA", name: "American Airlines", logo: "AA" },
  { code: "LH", name: "Lufthansa", logo: "LH" },
  { code: "SQ", name: "Singapore Airlines", logo: "SQ" },
  { code: "EK", name: "Emirates", logo: "EK" },
  { code: "AF", name: "Air France", logo: "AF" },
  { code: "BA", name: "British Airways", logo: "BA" },
  { code: "NH", name: "ANA", logo: "NH" },
  { code: "CX", name: "Cathay Pacific", logo: "CX" },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateFlights(count: number, basePrice: number, origin: string, destination: string, date: string) {
  return Array.from({ length: count }, (_, i) => {
    const airline = AIRLINES[i % AIRLINES.length];
    const stops = i < count * 0.4 ? 0 : randomInt(1, 2);
    const duration = 480 + stops * 90 + randomInt(-60, 120);
    const price = basePrice + randomInt(-150, 300) + stops * -80;
    const departureHour = randomInt(5, 22);
    const departureMin = [0, 15, 30, 45][randomInt(0, 3)];
    const departureTime = `${String(departureHour).padStart(2, "0")}:${String(departureMin).padStart(2, "0")}`;
    const arrivalTotalMin = departureHour * 60 + departureMin + duration;
    const arrivalHour = Math.floor(arrivalTotalMin / 60) % 24;
    const arrivalMin = arrivalTotalMin % 60;
    const arrivalTime = `${String(arrivalHour).padStart(2, "0")}:${String(arrivalMin).padStart(2, "0")}`;

    return {
      id: i + 1,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${randomInt(100, 999)}`,
      origin,
      destination,
      departureTime,
      arrivalTime,
      duration,
      stops,
      stopCities: stops > 0 ? [["SFO", "LAX", "ORD", "DFW", "JFK"][randomInt(0, 4)]] : [],
      price: Math.max(200, price),
      currency: "USD",
      class: "economy",
      seatsLeft: randomInt(2, 45),
      refundable: i % 3 === 0,
      carbonKg: randomFloat(150, 800, 0),
      dealScore: randomFloat(6.5, 9.8, 1),
      baggage: stops === 0 ? "1 carry-on + 1 checked bag" : "1 carry-on",
      date,
    };
  });
}

router.get("/flights/search", async (req, res) => {
  const { origin, destination, departureDate, returnDate, passengers, class: cabinClass } = req.query;
  const basePrice = 680;
  const flights = generateFlights(12, basePrice, (origin as string) ?? "SFO", (destination as string) ?? "NRT", (departureDate as string) ?? "2025-04-01");
  flights.sort((a, b) => a.price - b.price);
  res.json({
    flights,
    total: flights.length,
    currency: "USD",
    searchParams: { origin, destination, departureDate, returnDate, passengers, class: cabinClass },
  });
});

router.get("/flights/price-calendar", async (req, res) => {
  const { origin, destination, month } = req.query;
  const baseDate = new Date(2025, 3, 1);
  const calendar = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(i + 1);
    const price = 680 + Math.sin(i * 0.4) * 200 + Math.random() * 100;
    return {
      date: d.toISOString().split("T")[0],
      price: Math.round(price),
      currency: "USD",
      available: Math.random() > 0.1,
      isDeal: price < 700,
    };
  });
  res.json({ calendar, origin, destination, month });
});

export default router;
