// Stringifies an object without quotes around keys
export default function(obj) {
  return JSON.stringify(obj).replace(/"([^(")"]+)":/g, "$1:");
}
