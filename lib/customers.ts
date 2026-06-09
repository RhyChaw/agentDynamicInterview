import type { Customer } from "@/types/call";

export const STORE_PHONE = "(519) 555-0142";

export const customers: Customer[] = [
  {
    id: "raj",
    name: "Raj Patel",
    phone: "(519) 555-0187",
    address: "42 King St N, Waterloo, ON",
    pastPurchase: "Bedroom carpet",
    lastOrderYear: 2023,
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    phone: "(519) 555-0234",
    address: "18 Columbia St W, Waterloo, ON",
    pastPurchase: "Living room laminate",
    lastOrderYear: 2024,
  },
  {
    id: "mike",
    name: "Mike O'Brien",
    phone: "(519) 555-0311",
    address: "7 Erb St E, Waterloo, ON",
    pastPurchase: "Basement vinyl plank",
    lastOrderYear: 2022,
  },
  {
    id: "lisa",
    name: "Lisa Nguyen",
    phone: "(519) 555-0445",
    address: "203 University Ave W, Waterloo, ON",
    pastPurchase: "Hallway runner",
    lastOrderYear: 2024,
  },
  {
    id: "david",
    name: "David Morrison",
    phone: "(519) 555-0522",
    address: "55 Bridgeport Rd E, Waterloo, ON",
    pastPurchase: "Stair carpet",
    lastOrderYear: 2021,
  },
];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
