import { useState, useEffect } from 'react'

function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadExpenses()
    }, [])

    const loadExpenses = async () => {
        try {
            const data = await window.api.getExpenses()
            const list = Array.isArray(data) ? data : []
            setExpenses(list)
            setTotal(list.reduce((sum, e) => sum + e.amount, 0))
        } catch (err) {
            console.error('Error loading expenses:', err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await window.api.deleteExpense(id)
            loadExpenses()
        } catch (err) {
            console.error('Error deleting expense:', err)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const item = {
                category: document.getElementById('category').value,
                amount: parseFloat(document.getElementById('amount').value),
                description: document.getElementById('description').value,
            }
            await window.api.addExpense(item)
            setShowForm(false)
            loadExpenses()
        } catch (err) {
            console.error('Error adding expense:', err)
        }
    }

    const filtered = expenses.filter(e =>
        e.category?.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Expenses</h1>
                    <p className="text-gray-400 text-sm mt-1">Track and manage store outlays and expenditures</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-900/30 flex items-center gap-2 cursor-pointer"
                >
                    <span className="text-lg font-bold">+</span> Add Expense
                </button>
            </div>

            {/* Total card */}
            <div className="bg-red-950 bg-opacity-30 border border-red-800/60 rounded-2xl p-5 mb-6 shadow-xl backdrop-blur-sm">
                <p className="text-red-400 text-sm font-medium uppercase tracking-wider">Total Outflows</p>
                <p className="text-4xl font-extrabold text-white mt-1">{total.toLocaleString()} DA</p>
            </div>

            {/* Search and Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search expenses by category or description..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-gray-800/80 text-white border border-gray-700/80 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-gray-850 rounded-2xl bg-gray-800/40 backdrop-blur-sm shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="bg-gray-800/90 text-gray-400 uppercase text-xs font-semibold tracking-wider border-b border-gray-750">
                            <tr>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-750">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500 py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-2xl">💸</span>
                                            <p className="text-base font-medium">No expenses found</p>
                                            <p className="text-xs text-gray-650">Add a new expense or modify your search query</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/40 text-red-400 border border-red-900/30">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-350 max-w-xs truncate" title={item.description}>
                                            {item.description || <span className="text-gray-600 italic">No description</span>}
                                        </td>
                                        <td className="px-6 py-4 text-red-400 font-bold text-base">
                                            - {item.amount.toLocaleString()} DA
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {item.date ? item.date.split(' ')[0] : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-500 hover:text-red-400 active:scale-95 transition-all text-xs font-semibold hover:underline bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-900/20 cursor-pointer"
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
            </div>

            {/* Add Expense Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>💸</span> Add New Expense
                            </h2>
                            <button 
                                onClick={() => setShowForm(false)} 
                                className="text-gray-400 hover:text-white transition-colors text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="category" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                                <select 
                                    id="category" 
                                    className="bg-gray-700 text-white rounded-xl px-4 py-2.5 outline-none border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
                                    required
                                >
                                    <option value="Stock / Inventory">Stock & Inventory Purchase</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Utilities">Utilities (Power, Net, Water)</option>
                                    <option value="Salaries">Employee Salaries</option>
                                    <option value="Marketing">Marketing & Advertising</option>
                                    <option value="Hardware / Equipment">Hardware & Tools</option>
                                    <option value="Other">Other Expenses</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="amount" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount (DA)</label>
                                <input 
                                    id="amount" 
                                    type="number" 
                                    step="any"
                                    placeholder="Amount in Dinar" 
                                    required
                                    className="bg-gray-700 text-white rounded-xl px-4 py-2.5 outline-none border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-500 font-semibold" 
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="description" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                <textarea 
                                    id="description" 
                                    placeholder="Provide context for this expenditure..." 
                                    rows="3"
                                    className="bg-gray-700 text-white rounded-xl px-4 py-2.5 outline-none border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-500" 
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button 
                                    type="submit"
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20 active:scale-95 transition-all cursor-pointer"
                                >
                                    Save Expense
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-650 text-white py-3 rounded-xl font-semibold active:scale-95 transition-all cursor-pointer"
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

export default Expenses
