export const useTimes = () => {

    const formatTime = (time: number | string | Date | undefined ): string => {
    if (!time) return '';
    const date = new Date(time);
    const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    } as const;
    const formattedTime = date.toLocaleString('en-US', options);
    return formattedTime;
    }

    return {
        formatTime
    }
}