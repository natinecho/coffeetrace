import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowDownRight, IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useSession } from "next-auth/react";

interface propsType{
  title:string
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthlyEarnings = ({title}:propsType) => {
  const session = useSession();
  const [earningsData, setEarningsData] = useState<number[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';

  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const fetchEarningsData = async () => {
    if (!session?.data?.accessToken) {
      console.error("No access token available");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/transaction/getmytransactions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.data.accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const transactions = data.data; // assuming data.data contains the transactions
        const earnings: number[] = [];

        // Filter transactions by the selected month
        transactions?.forEach((transaction: any) => {
          const date = new Date(transaction.datetime);
          const transactionMonth = date.getMonth() + 1; // Get month (1-12)
            
          
            if (transaction.amount > 0) {
              earnings.push(transaction.amount);
          }
        });

        setEarningsData(earnings);
        setTotalEarnings(earnings.reduce((a, b) => a + b, 0));
      } else {
        console.error("Failed to fetch earnings data:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching earnings data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [, session]); // Fetch data whenever the selected month or session changes

  const seriescolumnchart = [
    {
      name: '',
      color: secondary,
      data: loading ? Array(7).fill(0) : earningsData, // Fallback to zeroes while loading
    },
  ];

  return (
    <DashboardCard
      title={`${title}`}
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff', zIndex: 10 }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height={60} width={"100%"} />
      }
    >
      <>
        {loading ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <Typography variant="h3" fontWeight="700" mt="-20px">
            ${totalEarnings.toLocaleString()} {/* Display total earnings */}
          </Typography>
        )}
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
