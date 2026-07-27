import { useState } from "react";
import { getMarketPrices } from "../services/marketService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function MarketPrices() {
  const [state, setState] = useState("Telangana");
  const [crop, setCrop] = useState("Tomato");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    if (!state.trim() || !crop.trim()) {
      toast.error("Please enter State and Crop");
      return;
    }

    try {
      setLoading(true);

      const res = await getMarketPrices(state, crop);

      setPrices(res.data);

      toast.success("Market Prices Updated 📈");

    } catch (err) {
      console.log(err);

      toast.error("Unable to fetch market prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-8">

      <h1 className="text-5xl font-bold text-center text-green-700 mb-3">
        📈 Market Prices
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Check the latest mandi prices across India.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">

        <input
          className="border-2 border-green-300 rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter State"
        />

        <input
          className="border-2 border-green-300 rounded-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Enter Crop"
        />

        <button
          onClick={fetchPrices}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
        >
          Search
        </button>

      </div>

      {loading && <LoadingSpinner />}

      {!loading && prices.length === 0 && (
        <div className="text-center mt-16">

          <div className="text-7xl mb-5">
            🌾
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            Search Market Prices
          </h2>

          <p className="text-gray-500 mt-2">
            Enter State and Crop name to view latest prices.
          </p>

        </div>
      )}

      {!loading && prices.length > 0 && (

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-green-700 text-white p-5">

            <h2 className="text-2xl font-bold">
              📊 Latest Market Prices
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-green-100">

                <tr className="text-green-800">

                  <th className="p-4">Market</th>

                  <th className="p-4">District</th>

                  <th className="p-4">Commodity</th>

                  <th className="p-4">Min Price</th>

                  <th className="p-4">Max Price</th>

                  <th className="p-4">Modal Price</th>

                </tr>

              </thead>

              <tbody>

                {prices.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-green-50 transition text-center"
                  >

                    <td className="p-4 font-semibold">
                      {item.market}
                    </td>

                    <td>{item.district}</td>

                    <td>{item.commodity}</td>

                    <td className="text-red-600 font-semibold">
                      ₹ {item.minPrice}
                    </td>

                    <td className="text-blue-600 font-semibold">
                      ₹ {item.maxPrice}
                    </td>

                    <td className="text-green-700 font-bold">
                      ₹ {item.modalPrice}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default MarketPrices;