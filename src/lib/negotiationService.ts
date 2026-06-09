export interface CounterRequest {
  id: string;
  employee: string;
  original: string;
  counter: string;
  coverage: string;
  status: "Pending" | "Approved" | "Declined";
  negotiationCount: number;
}

const STORAGE_KEY = "skill_gap_counter_request";

export function getCounterRequest(): CounterRequest | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error reading counter request from localStorage", e);
    return null;
  }
}

export function saveCounterRequest(req: CounterRequest | null): void {
  try {
    if (req) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(req));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Trigger custom storage event for in-tab real-time updates
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error writing counter request to localStorage", e);
  }
}

export function clearCounterRequest(): void {
  saveCounterRequest(null);
}
