export const formatDateWithOffset = (
  dateString: string,
  offsetDays: number = 0
): string => {
  const date = new Date(dateString);
  const newDate = new Date(date.getTime() + offsetDays * 24 * 60 * 60 * 1000); // Sumar días
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Meses empiezan en 0
  const year = newDate.getFullYear();
  return `${day}/${month}/${year}`;
};
