import { useState, useEffect } from 'react'

function Repairs() {
    const [repairs, setRepairs] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        loadRepairs()
    }, [])

    const loadRepairs = async () => {
        const data = await window.api.getRepairs()
        setRepairs(Array.isArray(data) ? data : [])
    }

    const handleDelete = async (id) => {
        try {
            await window.api.deleteRepair(id)
            loadRepairs()
        } catch (err) {
            console.error('Error deleting repair:', err)
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await window.api.updateRepairStatus({ id, status })
            loadRepairs()
        } catch (err) {
            console.error('Error updating status:', err)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const repair = {
                customer_name: document.getElementById('customer_name').value,
                customer_phone: document.getElementById('customer_phone').value,
                device: document.getElementById('device').value,
                issue: document.getElementById('issue').value,
                status: 'pending',
                cost: parseFloat(document.getElementById('cost').value) || 0,
            }
            await window.api.addRepair(repair)
            setShowForm(false)
            loadRepairs()
        } catch (err) {
            console.error('Error adding repair:', err)
        }
    }

    const filtered = repairs.filter(r =>
        r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.device.toLowerCase().includes(search.toLowerCase())
    )

    const statusColor = (status) => {
        if (status === 'done') return 'text-green-400'
        if (status === 'in_progress') return 'text-yellow-400'
        return 'text-red-400'
    }

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Repairs</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    + New Repair
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by customer or device..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 mb-6 outline-none focus:border-blue-500"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Device</th>
                            <th className="px-4 py-3">Issue</th>
                            <th className="px-4 py-3">Cost</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-8">
                                    No repairs found
                                </td>
                            </tr>
                        ) : (
                            filtered.map(repair => (
                                <tr key={repair.id} className="border-b border-gray-700 hover:bg-gray-800">
                                    <td className="px-4 py-3">{repair.customer_name}</td>
                                    <td className="px-4 py-3">{repair.customer_phone}</td>
                                    <td className="px-4 py-3">{repair.device}</td>
                                    <td className="px-4 py-3">{repair.issue}</td>
                                    <td className="px-4 py-3">{repair.cost} DA</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={repair.status}
                                            onChange={e => handleStatusChange(repair.id, e.target.value)}
                                            className={`bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs ${statusColor(repair.status)}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(repair.id)}
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

            {/* Add Repair Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">New Repair</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-3">
                            <input id="customer_name" type="text" placeholder="Customer name" required
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />
                            <input id="customer_phone" type="text" placeholder="Customer phone"
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />
                            <input id="device" type="text" placeholder="Device (ex: Dell Laptop)" required
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />
                            <input id="issue" type="text" placeholder="Issue (ex: screen broken)" required
                                className="bg-gray-700 text-white rounded-lg px-4 py-2 outline-none border border-gray-600" />
                            <input id="cost" type="number" placeholder="Repair cost (DA)"
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

export default Repairs