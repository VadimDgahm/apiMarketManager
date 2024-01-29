export const getCurrentDate = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); 
    let day = ('0' + currentDate.getDate()).slice(-2);
    let normalizedDate = `${day}.${month}.${year}`
    return normalizedDate
}