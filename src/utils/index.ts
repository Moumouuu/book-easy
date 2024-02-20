export const appTitle = "Bookeasy";

export const formatDate = (date: string) => {
  const options: any = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
};

export const formatDateWithTime = (date: string | null) => {
  if (!date) return "";
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(date).toLocaleDateString("fr-FR", options);
};
