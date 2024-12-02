import React from "react";
import { FaHandHoldingUsd, FaSortAmountUpAlt } from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { useSession } from "next-auth/react";

interface CardProps{
  earlning:number
  expense:number
}
const Cards = ({earlning,expense}:CardProps) => {
  const session = useSession()
  const card = [
    {
      icon: <TbMoneybag />,
      name: "income",
      amount:session.data?.user.role === 'farmer' || session.data?.user.role === 'driver' ? earlning : 0,
      bg: "bg-lime-200",
    },
    {
      icon: <FaSortAmountUpAlt />,

      name: "Amount",
      amount: `${expense} kg`,
      bg: "bg-[#FF82AC]",
    },
    {
      icon: <FaHandHoldingUsd />,
      name: "Expense",
      amount: session.data?.user.role === 'merchant' ? earlning : 0,
      bg: "bg-blue-200",
    },
  ];
  return (
    <>
      <div className="flex flex-wrap justify-between px-3 gap-5">
        {card.map((items, index) => (
          <div
            key={index}
            className="flex gap-3 py-4 w-full sm:w-[30%] px-5 border border-gray-200 rounded-xl shadow-md"
          >
            <div className={`text-3xl ${items.bg} rounded-full p-3 md:p-4`}>
              {items.icon}
            </div>
            <div className="flex flex-col">
              <p>{items.name}</p>
              <p className="font-bold text-2xl">{items.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Cards;
