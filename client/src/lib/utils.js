export function formatmessageDate(date) {

    const option={ hour:"2-digit", minute:"2-digit",hour12:false}
    return new Date(date).toLocaleTimeString("en-US",option)
}