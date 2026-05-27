import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import db from '../database/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Create the Desktop window
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        }
    })

    //In developement load from vite server 
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
}

//when electron is ready create the window
app.whenReady().then(createWindow)

//close app when all windows are closed 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

//----------database handler

//products 
ipcMain.handle('products:getAll', () => {
    return db.prepare('SELECT * FROM products').all()
})

ipcMain.handle('products:add', (event, product) => {
    const stmt = db.prepare(`
        INSERT INTO products (name, category, quantity, buy_price, sell_price, condition, description)
        VALUES (@name, @category, @quantity, @buy_price, @sell_price, @condition, @description)`)
    return stmt.run(product)
})

ipcMain.handle('products:delete', (event, id) => {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id)

})

ipcMain.handle('products:update', (event, product) => {
    const stmt = db.prepare(`
        UPDATE products SET 
            name = @name,
            category = @category, 
            quantity = @quantity,
            buy_price = @buy_price,
            sell_price = @sell_price,
            condition = @condition,
            description = @description
        WHERE id = @id
            `)
    return stmt.run(product)
})
// Repairs
ipcMain.handle('repairs:getAll', () => {
    return db.prepare('SELECT * FROM repairs').all()
})

ipcMain.handle('repairs:add', (event, repair) => {
    const stmt = db.prepare(`
    INSERT INTO repairs (customer_name, customer_phone, device, issue, status, cost)
    VALUES (@customer_name, @customer_phone, @device, @issue, @status, @cost)
  `)
    return stmt.run(repair)
})

ipcMain.handle('repairs:delete', (event, id) => {
    return db.prepare('DELETE FROM repairs WHERE id = ?').run(id)
})

ipcMain.handle('repairs:updateStatus', (event, { id, status }) => {
    return db.prepare('UPDATE repairs SET status = ? WHERE id = ?').run(status, id)
})

// Expenses
ipcMain.handle('expenses:getAll', () => {
    return db.prepare('SELECT * FROM expenses').all()
})

ipcMain.handle('expenses:add', (event, expense) => {
    const stmt = db.prepare(`
    INSERT INTO expenses (category, amount, description)
    VALUES (@category, @amount, @description)
  `)
    return stmt.run(expense)
})

ipcMain.handle('expenses:delete', (event, id) => {
    return db.prepare('DELETE FROM expenses WHERE id = ?').run(id)
})

// Income (transactions + repairs + other_income)
ipcMain.handle('income:getAll', () => {
    return db.prepare('SELECT * FROM other_income').all()
})

ipcMain.handle('income:add', (event, income) => {
    const stmt = db.prepare(`
    INSERT INTO other_income (source, amount, note)
    VALUES (@source, @amount, @note)
  `)
    return stmt.run(income)
})

ipcMain.handle('income:delete', (event, id) => {
    return db.prepare('DELETE FROM other_income WHERE id = ?').run(id)
})

// Currencies
ipcMain.handle('currencies:getAll', () => {
    return db.prepare('SELECT * FROM currencies').all()
})

ipcMain.handle('currencies:add', (event, currency) => {
    const stmt = db.prepare(`
    INSERT INTO currencies (type, currency, amount, rate, total_dzd, note)
    VALUES (@type, @currency, @amount, @rate, @total_dzd, @note)
  `)
    return stmt.run(currency)
})

ipcMain.handle('currencies:delete', (event, id) => {
    return db.prepare('DELETE FROM currencies WHERE id = ?').run(id)
})