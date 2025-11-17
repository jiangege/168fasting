import { openDB } from "idb";

const DB_NAME = "168fasting";
const DB_VERSION = 1;
const STORE_NAME = "fasting_data";

let dbPromise = null;

// 初始化数据库
async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

// 获取数据
export async function getItem(key) {
  try {
    const db = await initDB();
    const value = await db.get(STORE_NAME, key);
    console.log(`[DB] getItem(${key}):`, value);
    return value;
  } catch (error) {
    console.error("Error getting item:", error);
    return null;
  }
}

// 设置数据
export async function setItem(key, value) {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, value, key);
    console.log(`[DB] setItem(${key}):`, value);
  } catch (error) {
    console.error("Error setting item:", error);
    throw error;
  }
}

// 删除数据
export async function removeItem(key) {
  try {
    const db = await initDB();
    await db.delete(STORE_NAME, key);
    console.log(`[DB] removeItem(${key})`);
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
}

// 清空所有数据
export async function clear() {
  try {
    const db = await initDB();
    await db.clear(STORE_NAME);
    console.log("[DB] clear all data");
  } catch (error) {
    console.error("Error clearing store:", error);
    throw error;
  }
}
