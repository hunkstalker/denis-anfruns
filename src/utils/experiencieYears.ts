export default function experiencieYears(): number {
  const startWorkingDual: number = 1;
  const startWorkingYear: number = 2022;
  const currentYear: number = new Date().getFullYear();

  return (currentYear - startWorkingYear) + startWorkingDual;
}