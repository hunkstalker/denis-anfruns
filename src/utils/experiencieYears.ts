export default function experiencieYears(): number {
  const startWorkingDual: number = 1;
  const startWorkingYear: number = new Date('2022-09-01').getFullYear();
  const currentYear: number = new Date().getFullYear();

  return Math.abs(currentYear - startWorkingYear) + startWorkingDual;
}