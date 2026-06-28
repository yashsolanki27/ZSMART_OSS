/* ============================================================
   Mock-data generator utilities.
   Produces deterministic-ish realistic telecom records so every
   list page feels populated. Swap for REST API in Phase 2.
   ============================================================ */

const AREAS = [
  "TNJAFS", "KNLMCO", "ERDNJM", "NGPKAO", "MUMBAI", "DELHI",
  "CHENNAI", "KOLKATA", "BANGLORE", "HYDERABAD", "PUNE", "AHMEDABAD",
];

const CFS_SPECS = [
  "PON Access", "Bharat Fiber Voice", "Bharat Fiber BB",
  "BROADBAND", "IPTV", "MPLS VPN", "SIP Trunk", "Leased Line",
];

const CFS_EVENTS = [
  "NEW CONNECTION", "CHANGE PLAN", "DISCONNECTION",
  "SUSPEND", "RESUME", "MODIFY",
];

const PRIORITIES = ["Standard", "High", "Critical", "Low"];
const STATES = ["Normal", "Exception", "Finished", "In Progress", "Pending"];

const STAFF = [
  "R. Kumar", "A. Sharma", "S. Patel", "P. Reddy", "M. Singh",
  "K. Nair", "D. Gupta", "V. Iyer", "J. Mehta", "L. Das",
];

const TICKET_PREFIXES = ["BFCNC", "BFCMOD", "LBSDIS", "BFCRES", "BFCSUS", "BBNWMPLS", "INC"];

// Tiny seeded RNG so data is stable between renders (no flicker).
let _seed = 42;
const rand = () => {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
};
export { rand };
export const resetSeed = (s = 42) => { _seed = s; };

const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pad = (n, len) => String(n).padStart(len, "0");

export const id = (prefix, len = 6) => `${prefix}${pad(Math.floor(rand() * 10 ** len), len)}`;

export const phone = () => {
  const a = pad(Math.floor(rand() * 99999), 5);
  const b = pad(Math.floor(rand() * 999999), 6);
  return `${a}-${b}`;
};

export const orderNumber = () => `${pick(TICKET_PREFIXES)}${pad(Math.floor(rand() * 1000000), 6)}`;

// Format like screenshots: "DD-MM-YYYY HH:MM:SS"
export const dateStr = (offsetDays = 0) => {
  const d = new Date(2025, 2, 28, 19, 21, 1);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(d.getHours() - Math.floor(rand() * 48));
  const p = pad;
  return `${p(d.getDate(), 2)}-${p(d.getMonth() + 1, 2)}-${d.getFullYear()} ${p(d.getHours(), 2)}:${p(d.getMinutes(), 2)}:${p(d.getSeconds(), 2)}`;
};

export { AREAS, CFS_SPECS, CFS_EVENTS, PRIORITIES, STATES, STAFF, pick, pad };
