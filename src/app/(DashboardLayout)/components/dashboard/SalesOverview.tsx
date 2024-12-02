import React, { useEffect, useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartData {
  name: string;
  data: number[];
}

const SalesOverview = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const [month, setMonth] = useState(currentMonth.toString()); // Default to current month
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setMonth(event.target.value);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "16%",
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: [" "],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  const fetchData = async () => {
    // if (!session?.data?.accessToken) {
    //   console.error("No access token available");
    //   setLoading(false);
    //   return;
    // }

    try {
      const res = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/transaction/getmytransactions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.data?.accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const transactions = data.data;

        const earnings: number[] = [];
        const expenses: number[] = [];
        const categories: string[] = [];

        transactions?.forEach((transaction: any) => {
          const date = new Date(transaction.datetime.split("")[0]);
          const amount = Math.abs(transaction.amount);
          const isExpense = transaction.amount < 0;

          const formattedMonth = date.getMonth() +1; 

          // if (formattedMonth === currentMonth) {
            earnings.push(amount);
            expenses.push(0);
          // }
        });

        setChartData([
          {
            name: "Earnings",
            data: earnings,
          },
          {
            name: "Expenses",
            data: expenses,
          },
        ]);

        optionscolumnchart.xaxis.categories = categories; 
      } else {
        console.error("Failed to fetch data:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, month]); // Fetch data whenever the session or selected month changes

  return (
    <DashboardCard
      title="Transaction Overview"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
        >
          <MenuItem value={currentMonth}>Current Month</MenuItem>
          <MenuItem value={currentMonth - 1}>Previous Month</MenuItem>
          <MenuItem value={currentMonth - 2}>August</MenuItem>
        </Select>
      }
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Chart
          options={optionscolumnchart}
          series={chartData}
          type="bar"
          height={370}
          width={"100%"}
        />
      )}
    </DashboardCard>
  );
};

export default SalesOverview;
