"use client";
import React, { useEffect, useState } from "react";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";
import Loading from "@/app/loading";
import { MdOutlineShoppingBag, MdPayment } from "react-icons/md"; // Import your transaction icon
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Loader from "@/app/(DashboardLayout)/components/Loder/Loder";

interface Transaction {
  id: string;
  amount: number; // Ensure this is a number
  description: string;
  order_id: string;
  farmer_id: string;
  farmer_name: string;
  merchant_id: string;
  merchant_name: string;
  quantity: number;
  total_price: number; // Adding total_price to interface
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

interface RecentTransactionsProps {
  setTotalEarnings: (earnings: number) => void;
  setTotalAmount: (earnings: number) => void;
}

const RecentTransactions = ({
  setTotalEarnings,
  setTotalAmount,
}: RecentTransactionsProps) => {
  /////////////////////////////////
  // const [loading, setLoading] = useState<boolean>(false);
  /////////////////////////////////

  const [allPage, setAllPage] = useState(1);
  const [allData, setAllData] = useState<Transaction[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const session = useSession();
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/transaction/getmytransactions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.data?.accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const earnings: number[] = [];
        const quntity: number[] = [];

        // Filter transactions by the selected month
        data.data?.forEach((transaction: any) => {
          const date = new Date(transaction.datetime);
          const transactionMonth = date.getMonth() + 1; // Get month (1-12)

          if (transaction.amount > 0) {
            earnings.push(transaction.amount);
            quntity.push(transaction.quantity);
          }
        });
        setAllData(data.data);
        setTotalEarnings(earnings?.reduce((a, b) => a + b, 0));
        setTotalAmount(quntity?.reduce((a, b) => a + b, 0));
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (allData === undefined) return <Loading />;

  const totalAllPages = Math.ceil(allData?.length / itemsPerPage);

  const handlePrevPage = () => {
    if (allPage > 1) {
      setAllPage(allPage - 1);
    }
  };

  const handleNextPage = () => {
    if (allPage < totalAllPages) {
      setAllPage(allPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setAllPage(pageNumber);
  };

  const getPagedData = (data: Transaction[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data?.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderContent = () => {
    const transactions = getPagedData(allData, allPage);
    return transactions?.map((transaction) => ({
      ...transaction,
      amount: Math.abs(transaction.amount), // Ensure it's always positive
    }));
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="py-4 w-full">
      <h1 className="text-xl font-semibold mb-4 text-[#343C6A]">
        Recent Transactions
      </h1>
      <div className="border-b border-gray-200 dark:border-darkBorder flex justify-start gap-4 mb-2"></div>
      <Box sx={{ overflow: "auto", width: { xs: "400px", sm: "auto" } }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Transaction ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Quantity
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Amount
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Price
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderContent()?.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MdOutlineShoppingBag
                      style={{ fontSize: "24px", marginRight: "8px" }}
                    />
                    <Typography variant="subtitle2">
                      {transaction.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    {transaction.merchant_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2">
                    {formatDate(transaction.datetime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {transaction.quantity} kg
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">${transaction.amount} k</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    ${transaction.total_price} k
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {!(loading || session.status === "loading") ? (
        <div className="w-full flex justify-center items-center mt-4">
          <div className="flex justify-center items-center p-4">
            <button
              className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
              onClick={handlePrevPage}
            >
              <FaLessThan /> Previous
            </button>
            {Array.from({ length: totalAllPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageClick(i + 1)}
                className={`py-2 px-3 sm:px-4 md:py-2 rounded-xl mx-1 ${
                  i + 1 === allPage
                    ? "bg-palette-primary-main text-white"
                    : "bg-white text-palette-primary-main border border-primary.main"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
              onClick={handleNextPage}
            >
              Next <FaGreaterThan />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex item-center justify-center mt-10">
          <Loader />;
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
