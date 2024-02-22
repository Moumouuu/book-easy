// 'use client';
import DefaultError from "@/components/defaultError";
import { defaultFetcherGet } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { useCompany } from "@/store/dashboard";
import { Card, DonutChart, List, ListItem } from "@tremor/react";
import useSWR from "swr";

interface ReservationPart {
  name: string;
  amount: number;
  share: string;
  color: string;
}

const currencyFormatter = (number: number) => {
  return Intl.NumberFormat("fr").format(number).toString();
};

export default function ReservationPercentage() {
  const { companyId } = useCompany();
  const {
    data: partReservations,
    error,
    isLoading,
  } = useSWR(
    `/api/company/${companyId}/performance/reservations/percentage`,
    defaultFetcherGet,
  );

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <DefaultError title="Une erreur est survenue" message={error.message} />
    );

  const formatedColor = partReservations.map((book: ReservationPart) => {
    return book.color.slice(3, -4);
  });

  return (
    <>
      <Card className="m-3 sm:mx-auto sm:max-w-lg">
        <h3 className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Répartition des réservations
        </h3>
        <DonutChart
          className="mt-8"
          data={partReservations}
          category="amount"
          index="name"
          valueFormatter={currencyFormatter}
          showTooltip={false}
          colors={formatedColor}
        />
        <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content mt-8 flex items-center justify-between">
          <span>Catégories</span>
          <span>Nombre de clients / %</span>
        </p>
        <List className="mt-2">
          {partReservations.map((book: ReservationPart) => (
            <ListItem key={book.name} className="space-x-6">
              <div className="flex items-center space-x-2.5 truncate">
                <span
                  className={cn(book.color, "h-2.5 w-2.5 shrink-0 rounded-sm")}
                  aria-hidden={true}
                />
                <span className="dark:text-dark-tremor-content-emphasis truncate">
                  {book.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium tabular-nums">
                  {currencyFormatter(book.amount)}
                </span>
                <span className="rounded-tremor-small bg-tremor-background-subtle text-tremor-label text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis px-1.5 py-0.5 font-medium tabular-nums">
                  {book.share}
                </span>
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
