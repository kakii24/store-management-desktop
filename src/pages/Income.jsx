import { useState, useEffect } from 'react'

function Income() {
    const [income, setIncome] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadIncome()
    }, [])

    const loadIncome = async () => {
        const data = await window.api.getIncome()
        const list = Array.isArray(data) ? data : []
        setIncome(list)
        setTotal(list.reduce((sum, i) => sum + i.amount, 0))
    }

    const handleDelete = async (id) => {
        try {
            await window.api.deleteIncome(id)
            loadIncome()
        } catch (err) {
            console.error('Error deleting income:', err)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const item = {
                source: document.getElementById('source').value,
                amount: parseFloat(document.getElementById('amount').value),
                note: document.getElementById('note').value,
            }
            await window.api.addIncome(item)
            setShowForm(false)
            loadIncome()
        } catch (err) {
            console.error('Error adding income:', err)
        }
    }

    const filtered = income.filter(i =>
        i.source?.toLowerCase().includes(search.toLowerCase()) ||
        i.note?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Income</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Add Income
                </button>
            </div>

            {/* Total card */}
            <div className="bg-green-900 bg-opacity-40 border border-green-700 rounded-xl p-4 mb-6">
                <p className="text-green-400 text-sm">Total Income</p>
                <p className="text-3xl font-bold text-white">{total.toLocaleString()} DA</p>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search income..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 mb-6 outline-none focus:border-blue-500"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Note</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 py-8">
                                    No income found
                                </td>
                            </tr>
                        ) : (
                            filtered.map(item => (
                                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-800">
                                    <td className="px-4 py-3 text-green-400 font-medium">{item.source}</td>
                                    <td className="px-4 py-3 text-green-400">{item.amount.toLocaleString()} DA</td>
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

            {/* Add Income Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Add Income</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-3">

                            <input id="source" type="text" placeholder="Source (ex: laptop sale, repair)" required
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />

                            <input id="amount" type="number" placeholder="Amount (DA)" required
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

export default Income