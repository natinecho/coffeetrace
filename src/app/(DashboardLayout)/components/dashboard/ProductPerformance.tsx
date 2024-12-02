"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Loader from "@/app/(DashboardLayout)/components/Loder/Loder";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  order_id: string;
  farmer_id: string;
  farmer_name: string;
  merchant_id: string;
  merchant_name: string;
  quantity: number;
  total_price: number;
  datetime: string;
}

function formatDate(dateString: string): string {
  const datePart = dateString.split(" ")[0];
  const date = new Date(datePart);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

const ProductPerformance = () => {
  const [products, setProducts] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const route =
    session?.data?.user?.role === "farmer"
      ? "farmer"
      : session?.data?.user?.role === "merchant"
      ? "Buyer"
      : "Admin";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://cofeetracebackend-2.onrender.com/api/v0/transaction/getmytransactions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.data?.accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch transactions.");
        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data.slice(0, 5) : []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (session.status === "authenticated") {
      fetchProducts();
    }
  }, [session]);

  return (
    <DashboardCard title="Recent Transactions">
      <Box>
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <Table
            aria-label="recent transactions table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                {["Transaction ID", "Buyer Name", "Date", "Quantity", "Amount", "Total Price"].map(
                  (header) => (
                    <TableCell key={header} align={header === "Total Price" ? "right" : "left"}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {header}
                      </Typography>
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            {loading || session.status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Loader />
              </Box>
            ) : error ? (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            ) : (
              <TableBody>
                {products.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MdOutlineShoppingBag
                          style={{ fontSize: "24px", marginRight: "8px" }}
                        />
                        <Typography variant="subtitle2">{transaction.id}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{transaction.merchant_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle2">
                        {formatDate(transaction.datetime)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">{transaction.quantity} kg</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{formatNumber(transaction.amount)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{formatNumber(transaction.total_price)}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
            marginTop: "10px",
          }}
        >
          <Box
            component="button"
            onClick={() => (window.location.href = `/${route}/Transactions`)}
            sx={{
              padding: "10px 20px",
              backgroundColor: primary,
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
              "&:hover": { opacity: 0.9 },
            }}
            aria-label="Load More Transactions"
          >
            Load More
          </Box>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default dynamic(() => Promise.resolve(ProductPerformance), { ssr: false });
