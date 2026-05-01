import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ==================== USERS / PROFILES ====================
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  nationality: text("nationality"),
  dateOfBirth: text("date_of_birth"),
  phoneNumber: text("phone_number"),
  preferredCurrency: text("preferred_currency").notNull().default("USD"),
  preferredLanguage: text("preferred_language").notNull().default("en"),
  seatPreference: text("seat_preference"),
  mealPreference: text("meal_preference"),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  role: text("role").notNull().default("traveler"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// ==================== TRAVEL DOCUMENTS ====================
export const travelDocumentsTable = pgTable("travel_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  number: text("number"),
  issuingCountry: text("issuing_country"),
  expiryDate: text("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTravelDocumentSchema = createInsertSchema(travelDocumentsTable).omit({ id: true, createdAt: true });
export type InsertTravelDocument = z.infer<typeof insertTravelDocumentSchema>;
export type TravelDocument = typeof travelDocumentsTable.$inferSelect;

// ==================== SAVED LOYALTY PROGRAMS ====================
export const savedLoyaltyProgramsTable = pgTable("saved_loyalty_programs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  programName: text("program_name").notNull(),
  carrier: text("carrier").notNull(),
  membershipNumber: text("membership_number").notNull(),
  tier: text("tier"),
  points: integer("points"),
  expiryDate: text("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedLoyaltyProgramSchema = createInsertSchema(savedLoyaltyProgramsTable).omit({ id: true, createdAt: true });
export type InsertSavedLoyaltyProgram = z.infer<typeof insertSavedLoyaltyProgramSchema>;
export type SavedLoyaltyProgram = typeof savedLoyaltyProgramsTable.$inferSelect;

// ==================== LOYALTY ACCOUNTS ====================
export const loyaltyAccountsTable = pgTable("loyalty_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  points: integer("points").notNull().default(0),
  tier: text("tier").notNull().default("explorer"),
  annualSpend: numeric("annual_spend", { precision: 10, scale: 2 }).notNull().default("0"),
  pointsExpiringSoon: integer("points_expiring_soon").notNull().default(0),
  expiryDate: text("expiry_date"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLoyaltyAccountSchema = createInsertSchema(loyaltyAccountsTable).omit({ id: true, updatedAt: true });
export type InsertLoyaltyAccount = z.infer<typeof insertLoyaltyAccountSchema>;
export type LoyaltyAccount = typeof loyaltyAccountsTable.$inferSelect;

// ==================== LOYALTY TRANSACTIONS ====================
export const loyaltyTransactionsTable = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  points: integer("points").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  bookingRef: text("booking_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactionsTable).omit({ id: true, createdAt: true });
export type InsertLoyaltyTransaction = z.infer<typeof insertLoyaltyTransactionSchema>;
export type LoyaltyTransaction = typeof loyaltyTransactionsTable.$inferSelect;

// ==================== REWARDS ====================
export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
});

export const insertRewardSchema = createInsertSchema(rewardsTable).omit({ id: true });
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewardsTable.$inferSelect;

// ==================== TRIPS ====================
export const tripsTable = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull().default("planning"),
  coverImageUrl: text("cover_image_url"),
  totalBudget: numeric("total_budget", { precision: 10, scale: 2 }),
  totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0"),
  travelers: integer("travelers").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTripSchema = createInsertSchema(tripsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof tripsTable.$inferSelect;

// ==================== ITINERARY DAYS ====================
export const itineraryDaysTable = pgTable("itinerary_days", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  dayNumber: integer("day_number").notNull(),
  date: text("date").notNull(),
  title: text("title"),
  estimatedCost: numeric("estimated_cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
});

export const insertItineraryDaySchema = createInsertSchema(itineraryDaysTable).omit({ id: true });
export type InsertItineraryDay = z.infer<typeof insertItineraryDaySchema>;
export type ItineraryDay = typeof itineraryDaysTable.$inferSelect;

// ==================== ACTIVITIES ====================
export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  dayId: integer("day_id"),
  timeSlot: text("time_slot").notNull().default("flexible"),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  estimatedCost: numeric("estimated_cost", { precision: 10, scale: 2 }),
  duration: integer("duration"),
  category: text("category"),
  isBooked: boolean("is_booked").notNull().default(false),
  imageUrl: text("image_url"),
  tips: text("tips"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activitiesTable.$inferSelect;

// ==================== BOOKINGS ====================
export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tripId: integer("trip_id"),
  type: text("type").notNull(),
  status: text("status").notNull().default("confirmed"),
  reference: text("reference").notNull(),
  providerName: text("provider_name").notNull(),
  description: text("description").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  passengerCount: integer("passenger_count").notNull().default(1),
  isRefundable: boolean("is_refundable").notNull().default(false),
  passengers: jsonb("passengers").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<{
    origin: string | null;
    destination: string | null;
    flightNumber: string | null;
    seatNumbers: string | null;
    hotelAddress: string | null;
    confirmationDetails: string | null;
  }>().default({
    origin: null,
    destination: null,
    flightNumber: null,
    seatNumbers: null,
    hotelAddress: null,
    confirmationDetails: null,
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;

// ==================== EXPENSES ====================
export const expensesTable = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tripId: integer("trip_id"),
  reportId: integer("report_id"),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
  date: text("date").notNull(),
  merchant: text("merchant"),
  receiptUrl: text("receipt_url"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertExpenseSchema = createInsertSchema(expensesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expensesTable.$inferSelect;

// ==================== EXPENSE REPORTS ====================
export const expenseReportsTable = pgTable("expense_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tripId: integer("trip_id"),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  expenseCount: integer("expense_count").notNull().default(0),
  submittedAt: text("submitted_at"),
  approvedAt: text("approved_at"),
  paidAt: text("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertExpenseReportSchema = createInsertSchema(expenseReportsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertExpenseReport = z.infer<typeof insertExpenseReportSchema>;
export type ExpenseReport = typeof expenseReportsTable.$inferSelect;

// ==================== PRICE ALERTS ====================
export const priceAlertsTable = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  label: text("label").notNull(),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  targetPrice: numeric("target_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  priceChange: numeric("price_change", { precision: 10, scale: 2 }),
  priceChangePercent: numeric("price_change_percent", { precision: 5, scale: 2 }),
  triggered: boolean("triggered").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPriceAlertSchema = createInsertSchema(priceAlertsTable).omit({ id: true, createdAt: true });
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlertsTable.$inferSelect;

// ==================== NOTIFICATIONS ====================
export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  priority: text("priority").notNull().default("medium"),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;

// ==================== DESTINATIONS ====================
export const destinationsTable = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull().default(""),
  avgFlightPrice: numeric("avg_flight_price", { precision: 10, scale: 2 }),
  avgHotelPrice: numeric("avg_hotel_price", { precision: 10, scale: 2 }),
  bestMonths: jsonb("best_months").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  weather: jsonb("weather").$type<Record<string, string>>().default({}),
  visaInfo: text("visa_info").default("Check with your embassy"),
  currency: text("currency").default("USD"),
  language: text("language").default("English"),
  timezone: text("timezone").default("UTC"),
  dealScore: numeric("deal_score", { precision: 3, scale: 1 }),
  isPopular: boolean("is_popular").notNull().default(false),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({ id: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;

// ==================== HOTELS ====================
export const hotelsTable = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  address: text("address").notNull(),
  stars: integer("stars").notNull(),
  reviewScore: numeric("review_score", { precision: 3, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull().default(0),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  imageUrl: text("image_url"),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  freeCancellation: boolean("free_cancellation").notNull().default(false),
  aiSummary: text("ai_summary"),
  dealScore: numeric("deal_score", { precision: 3, scale: 1 }).notNull().default("7.5"),
  distanceFromCenter: numeric("distance_from_center", { precision: 5, scale: 2 }).notNull().default("1.0"),
  neighborhood: text("neighborhood"),
  pros: jsonb("pros").$type<string[]>().default([]),
  cons: jsonb("cons").$type<string[]>().default([]),
});

export const insertHotelSchema = createInsertSchema(hotelsTable).omit({ id: true });
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotelsTable.$inferSelect;

// ==================== HOTEL ROOMS ====================
export const hotelRoomsTable = pgTable("hotel_rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull(),
  name: text("name").notNull(),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer("max_guests").notNull().default(2),
  bedType: text("bed_type").notNull(),
  available: boolean("available").notNull().default(true),
});

export const insertHotelRoomSchema = createInsertSchema(hotelRoomsTable).omit({ id: true });
export type InsertHotelRoom = z.infer<typeof insertHotelRoomSchema>;
export type HotelRoom = typeof hotelRoomsTable.$inferSelect;

// ==================== ACTIVITY LISTINGS ====================
export const activityListingsTable = pgTable("activity_listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  duration: integer("duration").notNull(),
  reviewScore: numeric("review_score", { precision: 3, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull().default(0),
  imageUrl: text("image_url"),
  bookInAdvance: boolean("book_in_advance").notNull().default(false),
  groupSizeMin: integer("group_size_min").notNull().default(1),
  groupSizeMax: integer("group_size_max").notNull().default(20),
  tags: jsonb("tags").$type<string[]>().default([]),
});

export const insertActivityListingSchema = createInsertSchema(activityListingsTable).omit({ id: true });
export type InsertActivityListing = z.infer<typeof insertActivityListingSchema>;
export type ActivityListing = typeof activityListingsTable.$inferSelect;

// ==================== CORPORATE ====================
export const corporateTravelersTable = pgTable("corporate_travelers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  totalSpend: numeric("total_spend", { precision: 10, scale: 2 }).notNull().default("0"),
  tripsCount: integer("trips_count").notNull().default(0),
  complianceRate: numeric("compliance_rate", { precision: 5, scale: 2 }).notNull().default("100"),
  currentLocation: text("current_location"),
  status: text("status").notNull().default("idle"),
});

export const insertCorporateTravelerSchema = createInsertSchema(corporateTravelersTable).omit({ id: true });
export type InsertCorporateTraveler = z.infer<typeof insertCorporateTravelerSchema>;
export type CorporateTraveler = typeof corporateTravelersTable.$inferSelect;

export const approvalsTable = pgTable("approvals", {
  id: serial("id").primaryKey(),
  travelerName: text("traveler_name").notNull(),
  travelerEmail: text("traveler_email").notNull(),
  department: text("department").notNull(),
  tripDescription: text("trip_description").notNull(),
  destination: text("destination").notNull(),
  travelDates: text("travel_dates").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  reason: text("reason"),
  submittedAt: text("submitted_at").notNull(),
  reviewedAt: text("reviewed_at"),
  policyCompliant: boolean("policy_compliant").notNull().default(true),
  policyNotes: text("policy_notes"),
});

export const insertApprovalSchema = createInsertSchema(approvalsTable).omit({ id: true });
export type InsertApproval = z.infer<typeof insertApprovalSchema>;
export type Approval = typeof approvalsTable.$inferSelect;

export const travelPoliciesTable = pgTable("travel_policies", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().default(1),
  maxHotelRatePerNight: numeric("max_hotel_rate_per_night", { precision: 10, scale: 2 }).notNull().default("250"),
  maxFlightClassShortHaul: text("max_flight_class_short_haul").notNull().default("economy"),
  maxFlightClassLongHaul: text("max_flight_class_long_haul").notNull().default("business"),
  advanceBookingDays: integer("advance_booking_days").notNull().default(7),
  requiresApprovalAbove: numeric("requires_approval_above", { precision: 10, scale: 2 }).notNull().default("1500"),
  perDiemRate: numeric("per_diem_rate", { precision: 10, scale: 2 }).notNull().default("75"),
  currency: text("currency").notNull().default("USD"),
  preferredAirlines: jsonb("preferred_airlines").$type<string[]>().default([]),
  preferredHotelChains: jsonb("preferred_hotel_chains").$type<string[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTravelPolicySchema = createInsertSchema(travelPoliciesTable).omit({ id: true, updatedAt: true });
export type InsertTravelPolicy = z.infer<typeof insertTravelPolicySchema>;
export type TravelPolicy = typeof travelPoliciesTable.$inferSelect;

// ==================== AI CHAT ====================
export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
