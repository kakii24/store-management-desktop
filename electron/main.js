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
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,

        }
    })

    //In developement load from vite server 
    win.loadURL('http://localhost:5173')
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
            category = @vategory, 
            quantity = @quantity,
            buy_price = @buy_price,
            sell_price = @sell_price,
            condition = @condition,
            description = @description
        WHERE id = @id
            `)
    return stmt.run(product)
})
