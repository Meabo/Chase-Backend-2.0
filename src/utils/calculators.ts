export const _calculateAge = (birthday: Date) => { // birthday is a date
    const birthDayToDate = new Date(birthday)
    var ageDifMs = Date.now() - birthDayToDate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}