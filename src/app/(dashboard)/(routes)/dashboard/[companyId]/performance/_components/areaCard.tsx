// 'use client';
import { cn } from "@/lib/utils";
import { AreaChart, Card, List, ListItem } from "@tremor/react";

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

const statusColor: any = {
  "Number of Reservations": "bg-blue-500",
  "Total Revenue": "bg-violet-500",
};

interface ICompanyStats {
  date: string;
  reservationCount: number;
  revenue: number;
}

export default function AreaCard({
  companyStats,
}: {
  companyStats: ICompanyStats[];
}) {
  const totalRevenue = companyStats.reduce(
    (acc: number, item: ICompanyStats) => acc + item.revenue,
    0,
  );
  const totalReservations = companyStats.reduce(
    (acc: number, item: ICompanyStats) => acc + item.reservationCount,
    0,
  );
  const summary = [
    {
      name: "Nombre de Réservations",
      value: totalReservations,
    },
    {
      name: "Chiffre d'Affaires",
      value: totalRevenue,
    },
  ];
  return (
    <>
      <Card className="m-5 sm:mx-auto sm:max-w-lg">
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Nombres de Réservations / Revenus des 7 derniers jours
        </h3>
        <AreaChart
          data={companyStats}
          index="date"
          categories={["reservationCount", "revenue"]}
          colors={["blue", "violet"]}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={false}
          showGradient={false}
          startEndOnly={true}
          className="mt-6 h-32"
        />
        <List className="mt-2">
          {summary.map((item) => (
            <ListItem key={item.name}>
              <div className="flex items-center space-x-2">
                <span
                  className={cn(statusColor[item.name], "h-0.5 w-3")}
                  aria-hidden={true}
                />
                <span>{item.name}</span>
              </div>
              <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                {valueFormatter(item.value)}
              </span>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
