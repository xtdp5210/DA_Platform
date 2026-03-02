import client from "./client";

// Stall status is "available" / "pending" / "booked" (not is_available boolean)
export const getAvailableStalls = () =>
  client.get("/exhibitions/available_stalls");

// Backend accepts single stall_id + company details (not stall_ids array)
export const registerForEvent = (stallId: number, formData: Record<string, string>) =>
  client.post("/exhibitions/register_exhibitor", { stall_id: stallId, ...formData });

export const getMyBookings = () => client.get("/exhibitions/my_bookings");