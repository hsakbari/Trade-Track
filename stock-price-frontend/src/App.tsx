import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

const socket = io("http://localhost:3000");

function App() {
  const [data, setData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currencyPairs = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT"];
  const lastUpdateTime = useRef(Date.now());

  const throttle = (callback, limit) => {
    return (...args) => {
      const now = Date.now();
      if (now - lastUpdateTime.current >= limit) {
        callback(...args);
        lastUpdateTime.current = now;
      }
    };
  };

  useEffect(() => {
    fetch("http://localhost:3000/trades")
      .then((response) => response.json())
      .then((initialData) => {
        const formattedData = initialData.reduce((acc, trade) => {
          acc[trade.symbol] = {
            symbol: trade.symbol,
            price: trade.price,
            oldPrice: null,
          };
          return acc;
        }, {});
        setData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    socket.on(
      "tradeUpdate",
      throttle((trade) => {
        setData((prevData) => ({
          ...prevData,
          [trade.symbol]: {
            symbol: trade.symbol,
            price: trade.price,
            oldPrice: prevData[trade.symbol]
              ? prevData[trade.symbol].price
              : null,
          },
        }));
      }, 500)
    );

    return () => {
      socket.off("tradeUpdate");
    };
  }, []);

  useEffect(() => {
    const sockets = {};

    const createWebSocket = (symbol) => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
      );

      ws.onopen = () => {
        console.log(`WebSocket connection established for ${symbol}`);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const price = parseFloat(message.p).toFixed(2);

        socket.emit("addTrade", {
          symbol: message.s,
          price: parseFloat(price),
        });
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${symbol}:`, error);
      };

      ws.onclose = () => {
        console.log(`WebSocket connection closed for ${symbol}`);
      };

      sockets[symbol] = ws;
    };

    currencyPairs.forEach(createWebSocket);

    return () => {
      Object.values(sockets).forEach((ws) => ws.close());
    };
  }, [currencyPairs]);

  return (
    <div
      className={`app ${
        isDarkMode ? "dark-mode" : ""
      } min-h-screen flex flex-col items-center transition-colors duration-500 ${
        isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"
      }`}
    >
      <header className="w-full flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">Trade Price Tracker</h1>
        <button
          className="bg-none border-none cursor-pointer text-2xl"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <MdOutlineLightMode className="text-4xl" />
          ) : (
            <MdDarkMode className="text-4xl" />
          )}
        </button>
      </header>
      <Table className="w-4/5 my-5 border-collapse mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 border text-left text-2xl dark:text-gray-200">
              Symbol
            </TableHead>
            <TableHead className="p-2 border text-left text-2xl dark:text-gray-200 w-40">
              Price
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencyPairs.map((pair) => (
            <TableRow key={pair}>
              <TableCell className="p-2 border">{data[pair]?.symbol}</TableCell>
              <TableCell
                id={`trade-${pair}`}
                className={`p-2 border transition-colors flex flex-row items-center duration-500 w-40 ${
                  data[pair]?.price > (data[pair]?.oldPrice || 0)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {data[pair]?.price}
                &nbsp;
                {data[pair]?.price > (data[pair]?.oldPrice || 0) ? (
                  <FaArrowTrendUp className="mx-1" />
                ) : (
                  <FaArrowTrendDown className="mx-1" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TableCaption className="text-lg mb-2">
        A list of Currencies.
      </TableCaption>
    </div>
  );
}

export default App;
