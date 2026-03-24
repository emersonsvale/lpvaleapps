export default defineEventHandler(() => {
    return {
        status: 'ok',
        service: 'vale-apps',
        timestamp: new Date().toISOString(),
    }
})