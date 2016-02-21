export function timeToText(time) {
  let minute = Math.round(time * 1440) % 1440;
  return ("0" + Math.floor(minute / 60)).slice(-2) + ":" + ("0" + (minute % 60)).slice(-2);
}
