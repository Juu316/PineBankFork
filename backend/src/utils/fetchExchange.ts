import axios from "axios";
import cron from "node-cron";

const API_KEY = process.env.EXCHANGE_API_KEY;
const currencyList = [
  "USD",
  "EUR",
  "JPY",
  "CHF",
  "GBP",
  "CNY",
  "KRW",
  "HKD",
  "CAD",
  "AUD",
  "SGD",
  "NZD",
];

let cachedRates: Record<string, number> = {};
let lastUpdated: string = "";

export const getCachedRates = () => ({
  rates: cachedRates,
  lastUpdated,
});

const fetchAndCacheRates = async () => {
  try {
    const ratesData: Record<string, number> = {};
    for (const code of currencyList) {
      const pairAPI_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/MNT/${code}`;
      const res = await axios.get(pairAPI_URL);
      const data = res.data;
      if (data.result === "success") {
        ratesData[code] = 1 / data.conversion_rate;
      } else {
        ratesData[code] = 0;
        console.error(`Error fetching rate for ${code}`);
      }
    }
    cachedRates = ratesData;
    const currentDate = new Date();
    lastUpdated = `${currentDate.getFullYear()}.${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}.${String(currentDate.getDate()).padStart(2, "0")}`;
    console.log("Exchange rates updated");
  } catch (err) {
    console.error("Error fetching exchange rates:", err);
  }
};

// Fetch immediately on server start
// fetchAndCacheRates();

// Schedule to fetch every 23 hours
cron.schedule("0 */23 * * *", fetchAndCacheRates);
