/**
 * 엑셀에서 사용되는 날짜 일련번호를 문자열 yyyy-MM-dd로 변환합니다.
 */
function excelDateToString(serial) {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);

  let month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;

  let day = date.getDate();
  if (day < 10) day = '0' + day;

  return date.getFullYear() + '-' + month + '-' + day;
}

/**
 * 오늘 날짜(yyyy-MM-dd)를 가져옵니다.
 */
function getTodayDate() {
  let today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return year + '-' + month + '-' + day;
}

function dateToString(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return year + '-' + month + '-' + day;
}

function dateToKrString(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return year + '년 ' + month + '월 ' + day + '일';
}

export { excelDateToString, getTodayDate, dateToString, dateToKrString };
