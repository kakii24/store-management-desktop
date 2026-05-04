import { useState, useEffect } from 'react'
function Inventory() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)

    //load products when page opens 
    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        const data = await window.api.getProducts()
        setProducts(Array.isArray(data) ? data : [])
    }

    //filter products by search 
    const handleDelete = async (id) => {   // ← must be here
        try {
            await window.api.deleteProduct(id)
            loadProducts()
        } catch (err) {
            console.error('Error deleting product:', err)
        }
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const product = {
                name: document.getElementById('name').value,
                category: document.getElementById('category').value,
                quantity: parseInt(document.getElementById('quantity').value),
                buy_price: parseFloat(document.getElementById('buy_price').value),
                sell_price: parseFloat(document.getElementById('sell_price').value),
                condition: document.getElementById('condition').value,
                description: document.getElementById('description').value,
            }
            await window.api.addProduct(product)
            setShowForm(false)
            loadProducts()
        } catch (err) {
            console.error('Error adding product:', err)
        }
    }
    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Inventory</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Add Product
                </button>
            </div>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 mb-6 outline-none focus:border-blue-500"
            />

            {/* Products count */}
            <p className="text-gray-400 mb-4">{filtered.length} products found</p>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Buy Price</th>
                            <th className="px-4 py-3">Sell Price</th>
                            <th className="px-4 py-3">Condition</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-8">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filtered.map(product => (
                                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-800">
                                    <td className="px-4 py-3">{product.name}</td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3">{product.quantity}</td>
                                    <td className="px-4 py-3">{product.buy_price} DA</td>
                                    <td className="px-4 py-3">{product.sell_price} DA</td>
                                    <td className="px-4 py-3">{product.condition}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Add Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">

                        <h2 className="text-xl font-bold text-white mb-4">Add Product</h2>

                        <form onSubmit={handleAdd} className="flex flex-col gap-3">

                            <input
                                type="text"
                                placeholder="Product name"
                                id="name"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500 border border-gray-600"
                                required
                            />

                            <select id="category" className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600">
                                <option value="computer">Computer</option>
                                <option value="phone">Phone</option>
                                <option value="part">Part</option>
                                <option value="other">Other</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Quantity"
                                id="quantity"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500 border border-gray-600"
                                required
                            />

                            <input
                                type="number"
                                placeholder="Buy price (DA)"
                                id="buy_price"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500 border border-gray-600"
                            />

                            <input
                                type="number"
                                placeholder="Sell price (DA)"
                                id="sell_price"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500 border border-gray-600"
                            />

                            <select id="condition" className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600">
                                <option value="new">New</option>
                                <option value="used">Used</option>
                                <option value="refurbished">Refurbished</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Description (optional)"
                                id="description"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500 border border-gray-600"
                            />

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
export default Inventory
