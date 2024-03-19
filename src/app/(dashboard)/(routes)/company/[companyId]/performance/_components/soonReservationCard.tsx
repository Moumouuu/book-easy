import DatatableSkeleton from "@/components/datatable/datatableSkeleton";
import DefaultError from "@/components/defaultError";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import { formatDateWithTime } from "@/utils";
import useSWR from "swr";

interface SoonReservations {
  email: string;
  start_at: string;
  end_at: string | null;
  price: number;
}

export function SoonReservationCard() {
  const { companyId } = useCompany();
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/reservations/soon`,
    defaultFetcherGet
  );

  if (isLoading) return <DatatableSkeleton />;

  if (error)
    return (
      <DefaultError title="Une erreur est survenue" message={error.message} />
    );

  const totalPrice = data.reduce(
    (acc: number, reservation: SoonReservations) => {
      return acc + reservation.price;
    },
    0
  );

  return (
    <div className="m-3 flex w-full flex-col">
      <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong ml-3 mr-1 font-semibold">
        Vos trois prochaines réservations
      </span>
      <Table>
        <TableCaption>
          {data.length === 0
            ? "Aucune prochaines réservations."
            : "Vos trois prochaines réservations."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Email du client</TableHead>
            <TableHead>Début de la réservation</TableHead>
            <TableHead>Fin de la réservation</TableHead>
            <TableHead className="text-right">Prix</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((reservation: SoonReservations) => (
            <TableRow key={reservation.email}>
              <TableCell className="font-medium">{reservation.email}</TableCell>
              <TableCell>{formatDateWithTime(reservation.start_at)}</TableCell>
              <TableCell>{formatDateWithTime(reservation.end_at)}</TableCell>
              <TableCell className="text-right">{reservation.price}€</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total des trois réservations</TableCell>
            <TableCell className="text-right">{totalPrice}€</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
