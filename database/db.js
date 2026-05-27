import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, '..', 'store.db'))

db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT ,
        quantity INTEGER DEFAULT 0,
        buy_price REAL,
        sell_price REAL,
        condition TEXT,
        description TEXT,
        date_added TEXT DEFAULT (datetime('now'))
        );
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        product_id INTEGER,
        price REAL,
        customer_name TEXT,
        note TEXT,
        date TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (product_id) REFERENCES products(id)
        );
    CREATE TABLE IF NOT EXISTS repairs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        device TEXT,
        issue TEXT,
        status TEXT DEFAULT 'pending',
        cost REAL,
        date_added TEXT DEFAULT (datetime('now'))
        );
    CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        amount REAL,
        description TEXT,
        date TEXT DEFAULT (datetime('now'))
        );
    CREATE TABLE IF NOT EXISTS currencies(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        currency TEXT,
        amount REAL,
        rate REAL,
        total_dzd REAL,
        note TEXT,
        date TEXT DEFAULT (datetime('now'))
        );
    CREATE TABLE IF NOT EXISTS other_income(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        amount REAL,
        note TEXT,
        date TEXT DEFAULT (datetime('now'))
        );
    CREATE TABLE IF NOT EXISTS cash_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        reason TEXT,
        date TEXT DEFAULT (datetime('now'))
  );
    `);

// Run defensive migrations to ensure existance of new columns in existing databases
try {
    db.exec(`ALTER TABLE currencies ADD COLUMN rate REAL`);
} catch (e) {
    // Column might already exist
}
try {
    db.exec(`ALTER TABLE currencies ADD COLUMN total_dzd REAL`);
} catch (e) {
    // Column might already exist
}

export default db;

