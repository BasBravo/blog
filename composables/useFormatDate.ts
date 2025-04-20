// by convention, composable function names start with "use"
export function useFormatDate(date: string | Date | number | { seconds: number; nanoseconds: number } | null, format: string = 'dd/MM/yyyy HH:mm:ss'): string {
    let dateFormated: Date | null = null;

    if (date && typeof date === 'object') {
        //if object contain seconds and nanoseconds
        if ('seconds' in date) {
            dateFormated = new Date(date.seconds * 1000);
        } else {
            dateFormated = new Date(date as string | number | Date);
        }
    }

    if (typeof date === 'string') dateFormated = new Date(date);

    if (typeof date === 'number') dateFormated = new Date(date);

    if (!dateFormated) return '';

    const day = dateFormated.getDate();
    const month = dateFormated.getMonth() + 1;
    const year = dateFormated.getFullYear();
    const hours = dateFormated.getHours();
    const minutes = dateFormated.getMinutes();
    // const seconds = dateFormated.getSeconds();

    const dayFormated = day < 10 ? '0' + day : day;
    const monthFormated = month < 10 ? '0' + month : month;
    const hoursFormated = hours < 10 ? '0' + hours : hours;
    const minutesFormated = minutes < 10 ? '0' + minutes : minutes;
    // const secondsFormated = seconds < 10 ? '0' + seconds : seconds;

    let dateFormatted = format;
    dateFormatted = dateFormatted.replace('dd', dayFormated.toString());
    dateFormatted = dateFormatted.replace('MM', monthFormated.toString());
    dateFormatted = dateFormatted.replace('yyyy', year.toString());
    dateFormatted = dateFormatted.replace('HH', hoursFormated.toString());
    dateFormatted = dateFormatted.replace('mm', minutesFormated.toString());
    dateFormatted = dateFormatted.replace(':ss', ''); // remove seconds
    // dateFormatted = dateFormatted.replace('ss', secondsFormated.toString());

    return dateFormatted;
}
