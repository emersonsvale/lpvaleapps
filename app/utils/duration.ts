interface DurationFormatOptions {
    signed?: boolean
    showPositiveSign?: boolean
}

export function formatSecondsAsDuration(value: number | null | undefined, options: DurationFormatOptions = {}): string {
    const numeric = Number(value || 0)
    const safe = Number.isFinite(numeric) ? numeric : 0
    const negative = safe < 0
    const totalSegundos = Math.round(Math.abs(safe))
    const horas = Math.floor(totalSegundos / 3600)
    const minutos = Math.floor((totalSegundos % 3600) / 60)
    const segundos = totalSegundos % 60
    const formatted = [horas, minutos, segundos].map((parte) => String(parte).padStart(2, '0')).join(':')

    if (!options.signed) return formatted
    if (negative) return `-${formatted}`
    if (options.showPositiveSign && safe > 0) return `+${formatted}`
    return formatted
}

export function formatHoursAsDuration(value: number | null | undefined, options: DurationFormatOptions = {}): string {
    return formatSecondsAsDuration(Number(value || 0) * 3600, options)
}