import { Router } from "express";
import { db } from "../db.js";
import { hotelsTable, hotelRoomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/hotels/search", async (req, res) => {
  const { destination, checkIn, checkOut, guests } = req.query;
  let hotels = await db.select().from(hotelsTable);

  if (destination && typeof destination === "string") {
    hotels = hotels.filter((h) =>
      h.destination.toLowerCase().includes(destination.toLowerCase()) ||
      h.name.toLowerCase().includes(destination.toLowerCase())
    );
  }

  const result = hotels.map((h) => ({
    ...h,
    pricePerNight: parseFloat(h.pricePerNight as string),
    reviewScore: parseFloat(h.reviewScore as string),
    dealScore: parseFloat(h.dealScore as string),
    distanceFromCenter: parseFloat(h.distanceFromCenter as string),
    nights: checkIn && checkOut
      ? Math.max(1, Math.ceil((new Date(checkOut as string).getTime() - new Date(checkIn as string).getTime()) / 86400000))
      : 1,
  }));

  res.json(result);
});

router.get("/hotels/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const hotel = await db.select().from(hotelsTable).where(eq(hotelsTable.id, id)).limit(1);
  if (!hotel.length) { res.status(404).json({ error: "Hotel not found" }); return; }
  const rooms = await db.select().from(hotelRoomsTable).where(eq(hotelRoomsTable.hotelId, id));
  res.json({ ...hotel[0], rooms });
});

export default router;
