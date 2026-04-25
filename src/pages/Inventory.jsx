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
        const data = await window.api.getProducts
        setProducts(data)
    }

    //filter products by search 
    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
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

        </div>
    )
}
export default Inventory 