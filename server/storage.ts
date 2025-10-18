import { type User, type InsertUser, type Gift, type InsertGift } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGift(gift: InsertGift): Promise<Gift>;
  getGift(id: string): Promise<Gift | undefined>;
  getAllGifts(): Promise<Gift[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gifts: Map<string, Gift>;

  constructor() {
    this.users = new Map();
    this.gifts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGift(insertGift: InsertGift): Promise<Gift> {
    const id = randomUUID();
    const gift: Gift = { 
      businessName: insertGift.businessName,
      businessType: insertGift.businessType,
      brandColors: insertGift.brandColors || null,
      emoji: insertGift.emoji || null,
      amount: insertGift.amount,
      recipientName: insertGift.recipientName,
      recipientEmail: insertGift.recipientEmail || null,
      recipientPhone: insertGift.recipientPhone || null,
      message: insertGift.message || null,
      stripeCardholderId: insertGift.stripeCardholderId || null,
      stripeCardId: insertGift.stripeCardId || null,
      cardNumber: insertGift.cardNumber || null,
      cardExpiry: insertGift.cardExpiry || null,
      cardCvv: insertGift.cardCvv || null,
      id,
      createdAt: new Date().toISOString()
    };
    this.gifts.set(id, gift);
    return gift;
  }

  async getGift(id: string): Promise<Gift | undefined> {
    return this.gifts.get(id);
  }

  async getAllGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }
}

export const storage = new MemStorage();
