const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // Products
  getProducts: () => ipcRenderer.invoke('products:getAll'),
  addProduct: (product) => ipcRenderer.invoke('products:add', product),
  deleteProduct: (id) => ipcRenderer.invoke('products:delete', id),
  updateProduct: (product) => ipcRenderer.invoke('products:update', product),

  // Repairs
  getRepairs: () => ipcRenderer.invoke('repairs:getAll'),
  addRepair: (repair) => ipcRenderer.invoke('repairs:add', repair),
  deleteRepair: (id) => ipcRenderer.invoke('repairs:delete', id),
  updateRepairStatus: (data) => ipcRenderer.invoke('repairs:updateStatus', data),

  // Expenses
  getExpenses: () => ipcRenderer.invoke('expenses:getAll'),
  addExpense: (expense) => ipcRenderer.invoke('expenses:add', expense),
  deleteExpense: (id) => ipcRenderer.invoke('expenses:delete', id),

  // Income
  getIncome: () => ipcRenderer.invoke('income:getAll'),
  addIncome: (income) => ipcRenderer.invoke('income:add', income),
  deleteIncome: (id) => ipcRenderer.invoke('income:delete', id),

  // Currencies
  getCurrencies: () => ipcRenderer.invoke('currencies:getAll'),
  addCurrency: (data) => ipcRenderer.invoke('currencies:add', data),
  deleteCurrency: (id) => ipcRenderer.invoke('currencies:delete', id),
})