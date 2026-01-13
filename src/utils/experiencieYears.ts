export default function experiencieYears(): number {
	const startMonth = 9 // Septiembre
	const startYear = 2021

	const now = new Date()
	const currentYear = now.getFullYear()
	const currentMonth = now.getMonth() + 1 // getMonth() devuelve 0-11

	let years = currentYear - startYear

	// Si aún no hemos llegado al mes de aniversario, restamos un año
	if (currentMonth < startMonth) {
		years--
	}

	return years
}
