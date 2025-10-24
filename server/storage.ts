import { type User, type InsertUser, type Gift, type InsertGift, type AccessRequest, type InsertAccessRequest, users, gifts, accessRequests } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGift(gift: InsertGift): Promise<Gift>;
  getGift(id: string): Promise<Gift | undefined>;
  getAllGifts(): Promise<Gift[]>;
  
  createAccessRequest(request: InsertAccessRequest): Promise<AccessRequest>;
  getAccessRequest(id: string): Promise<AccessRequest | undefined>;
  getAccessRequestByEmail(email: string): Promise<AccessRequest | undefined>;
  getAccessRequestByPhone(phone: string): Promise<AccessRequest | undefined>;
  getAllAccessRequests(): Promise<AccessRequest[]>;
  updateAccessRequest(id: string, updates: Partial<AccessRequest>): Promise<AccessRequest | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createGift(insertGift: InsertGift): Promise<Gift> {
    const [gift] = await db.insert(gifts).values({
      ...insertGift,
      createdAt: new Date().toISOString()
    }).returning();
    return gift;
  }

  async getGift(id: string): Promise<Gift | undefined> {
    const [gift] = await db.select().from(gifts).where(eq(gifts.id, id));
    return gift || undefined;
  }

  async getAllGifts(): Promise<Gift[]> {
    return await db.select().from(gifts);
  }

  async createAccessRequest(insertRequest: InsertAccessRequest): Promise<AccessRequest> {
    const [request] = await db.insert(accessRequests).values({
      ...insertRequest,
      createdAt: new Date().toISOString()
    }).returning();
    return request;
  }

  async getAccessRequest(id: string): Promise<AccessRequest | undefined> {
    const [request] = await db.select().from(accessRequests).where(eq(accessRequests.id, id));
    return request || undefined;
  }

  async getAccessRequestByEmail(email: string): Promise<AccessRequest | undefined> {
    const [request] = await db.select().from(accessRequests).where(eq(accessRequests.email, email));
    return request || undefined;
  }

  async getAccessRequestByPhone(phone: string): Promise<AccessRequest | undefined> {
    const [request] = await db.select().from(accessRequests).where(eq(accessRequests.phone, phone));
    return request || undefined;
  }

  async getAllAccessRequests(): Promise<AccessRequest[]> {
    return await db.select().from(accessRequests);
  }

  async updateAccessRequest(id: string, updates: Partial<AccessRequest>): Promise<AccessRequest | undefined> {
    const [request] = await db.update(accessRequests)
      .set(updates)
      .where(eq(accessRequests.id, id))
      .returning();
    return request || undefined;
  }
}

export const storage = new DatabaseStorage();
