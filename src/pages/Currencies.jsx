import { useState, useEffect } from 'react'

function Currencies() {
    const [currencies, setCurrencies] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        loadCurrencies()
    }, [])

    const loadCurrencies = async () => {
        const data = await window.api.getCurrencies()
        setCurrencies(Array.isArray(data) ? data : [])
    }

    const handleDelete = async (id) => {
        try {
            await window.api.deleteCurrency(id)
            loadCurrencies()
        } catch (err) {
            console.error('Error deleting currency:', err)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const amount = parseFloat(document.getElementById('amount').value)
            const rate = parseFloat(document.getElementById('rate').value)
            const item = {
                type: document.getElementById('type').value,
                currency: document.getElementById('currency').value,
                amount,
                rate,
                total_dzd: amount * rate,
                note: document.getElementById('note').value,
            }
            await window.api.addCurrency(item)
            setShowForm(false)
            loadCurrencies()
        } catch (err) {
            console.error('Error adding currency:', err)
        }
    }

    const filtered = currencies.filter(c =>
        c.currency?.toLowerCase().includes(search.toLowerCase()) ||
        c.type?.toLowerCase().includes(search.toLowerCase())
    )

    // Totals
    const totalUSDT = filtered
        .filter(c => c.currency === 'USDT' && c.type === 'buy')
        .reduce((sum, c) => sum + c.amount, 0)

    const totalEUR = filtered
        .filter(c => c.currency === 'EUR' && c.type === 'buy')
        .reduce((sum, c) => sum + c.amount, 0)

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Currencies</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Add Trade
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-yellow-900 bg-opacity-40 border border-yellow-700 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">USDT Bought</p>
                    <p className="text-2xl font-bold text-white">{totalUSDT.toLocaleString()} USDT</p>
                </div>
                <div className="bg-blue-900 bg-opacity-40 border border-blue-700 rounded-xl p-4">
                    <p className="text-blue-400 text-sm">EUR Bought</p>
                    <p className="text-2xl font-bold text-white">{totalEUR.toLocaleString()} EUR</p>
                </div>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search currencies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 mb-6 outline-none focus:border-blue-500"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Currency</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Rate</th>
                            <th className="px-4 py-3">Total DZD</th>
                            <th className="px-4 py-3">Note</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-gray-500 py-8">
                                    No trades found
                                </td>
                            </tr>
                        ) : (
                            filtered.map(item => (
                                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-800">
                                    <td className={`px-4 py-3 font-medium ${item.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                        {item.type}
                                    </td>
                                    <td className="px-4 py-3 font-bold">{item.currency}</td>
                                    <td className="px-4 py-3">{item.amount}</td>
                                    <td className="px-4 py-3">{item.rate}</td>
                                    <td className="px-4 py-3">{item.total_dzd?.toLocaleString()} DA</td>
                                    <td className="px-4 py-3">{item.note}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.date?.split('T')[0]}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(item.id)}
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

            {/* Add Trade Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Add Trade</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-3">

                            <select id="type"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600">
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>

                            <select id="currency"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600">
                                <option value="USDT">USDT</option>
                                <option value="EUR">EUR</option>
                            </select>

                            <input id="amount" type="number" placeholder="Amount" required
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />

                            <input id="rate" type="number" placeholder="Rate (ex: 245 DA per USDT)" required
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />

                            <input id="note" type="text" placeholder="Note (optional)"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />

                            <div className="flex gap-3 mt-2">
                                <button type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                                    Save
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-medium">
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

export default Currencies