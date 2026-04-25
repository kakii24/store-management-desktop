import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {

    // Products
    getProducts: () => ipcRenderer.invoke('products:getAll'),
    addProduct: (product) => ipcRenderer.invoke('products:add', product),
    deleteProduct: (id) => ipcRenderer.invoke('products:delete', id),
    updateProduct: (product) => ipcRenderer.invoke('products:update', product),

})
