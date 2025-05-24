import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/addedAxiosInstance";

const currencyList = [
  { code: "USD", name: "АМЕРИК ДОЛЛАР" },
  { code: "EUR", name: "ЕВРО" },
  { code: "JPY", name: "ЯПОНЫ ИЕН" },
  { code: "CHF", name: "ШВЕЙЦАР ФРАНК" },
  { code: "GBP", name: "АНГЛИЙН ФУНТ" },
  { code: "CNY", name: "ХЯТАДЫН ЮАНЬ" },
  { code: "KRW", name: "БНСУ-ЫН ВОН" },
  { code: "HKD", name: "ГОНКОНГ ДОЛЛАР" },
  { code: "CAD", name: "КАНАД ДОЛЛАР" },
  { code: "AUD", name: "АВСТРАЛИ ДОЛЛАР" },
  { code: "SGD", name: "СИНГАПУР ДОЛЛАР" },
  { code: "NZD", name: "ШИНЭ ЗЕЛАНД ДОЛЛАР" },
];

const formatNumber = (value: number) =>
  value.toLocaleString("mn-MN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function MNTExchangeTable() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axiosInstance.get("/exchange");
        console.log(res.data);
        console.log(typeof res.data);
        setRates(res.data.rates);
        setDate(res.data.lastUpdated);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
      }
    };
    fetchRates();
  }, []);

  return (
    <div className="w-full flex mt-10 items-center text-left justify-center min-h-[8rem] border-0 shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-lg">
      <div className="w-full max-w-5xl bg-white dark:bg-secondary shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2 text-black dark:text-white">
          Ханшийн мэдээ
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
          {date} өдрийн байдлаар
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-xs sm:text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2">
                  Валют
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2">
                  Валютын нэр
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2">
                  Ханш (MNT)
                </th>
              </tr>
            </thead>
            <tbody>
              {rates &&
                currencyList.map(({ code, name }) => (
                  <tr
                    key={code}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2 text-black dark:text-white">
                      {code}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2 text-black dark:text-white">
                      {name}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2 text-black dark:text-white">
                      {rates[code] !== undefined
                        ? formatNumber(rates[code])
                        : "Data not available"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
