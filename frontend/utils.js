export const parseIsoDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
}
