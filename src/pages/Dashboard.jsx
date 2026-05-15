import { useState, useEffect } from 'react'

function Dashboard() {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        totalInventory: 0,
        pendingRepairs: 0,
        totalRepairIncome: 0,
    })

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const [income, expenses, products, repairs] = await Promise.all([
                window.api.getIncome(),
                window.api.getExpenses(),
                window.api.getProducts(),
                window.api.getRepairs(),
            ])

            const totalIncome = Array.isArray(income)
                ? income.reduce((sum, i) => sum + i.amount, 0) : 0

            const totalExpenses = Array.isArray(expenses)
                ? expenses.reduce((sum, e) => sum + e.amount, 0) : 0

            const totalInventory = Array.isArray(products)
                ? products.reduce((sum, p) => sum + (p.sell_price * p.quantity), 0) : 0

            const pendingRepairs = Array.isArray(repairs)
                ? repairs.filter(r => r.status !== 'done').length : 0

            const totalRepairIncome = Array.isArray(repairs)
                ? repairs.filter(r => r.status === 'done').reduce((sum, r) => sum + r.cost, 0) : 0

            setStats({
                totalIncome,
                totalExpenses,
                totalInventory,
                pendingRepairs,
                totalRepairIncome,
            })
        } catch (err) {
            console.error('Error loading stats:', err)
        }
    }

    const netWorth = stats.totalIncome + stats.totalRepairIncome + stats.totalInventory - stats.totalExpenses

    const cards = [
        {
            label: 'Total Income',
            value: `${(stats.totalIncome + stats.totalRepairIncome).toLocaleString()} DA`,
            color: 'border-green-700 bg-green-900',
            text: 'text-green-400',
        },
        {
            label: 'Total Expenses',
            value: `${stats.totalExpenses.toLocaleString()} DA`,
            color: 'border-red-700 bg-red-900',
            text: 'text-red-400',
        },
        {
            label: 'Inventory Value',
            value: `${stats.totalInventory.toLocaleString()} DA`,
            color: 'border-blue-700 bg-blue-900',
            text: 'text-blue-400',
        },
        {
            label: 'Pending Repairs',
            value: stats.pendingRepairs,
            color: 'border-yellow-700 bg-yellow-900',
            text: 'text-yellow-400',
        },
    ]

    return (
        <div className="p-6">

            {/* Header */}
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-8">Welcome back! Here's your store overview.</p>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {cards.map(card => (
                    <div key={card.label}
                        className={`border bg-opacity-40 rounded-xl p-5 ${card.color}`}>
                        <p className={`text-sm mb-1 ${card.text}`}>{card.label}</p>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Net Worth */}
            <div className="border border-purple-700 bg-purple-900 bg-opacity-40 rounded-xl p-6 mb-8">
                <p className="text-purple-400 text-sm mb-1">💎 Total Net Worth</p>
                <p className="text-4xl font-bold text-white">{netWorth.toLocaleString()} DA</p>
                <p className="text-gray-400 text-xs mt-2">
                    Income + Repairs + Inventory Value - Expenses
                </p>
            </div>

            {/* Quick summary */}
            <div className="bg-gray-800 rounded-xl p-5">
                <h2 className="text-white font-bold mb-4">Quick Summary</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Income from sales & other</span>
                        <span className="text-green-400">{stats.totalIncome.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Income from repairs</span>
                        <span className="text-green-400">{stats.totalRepairIncome.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total expenses</span>
                        <span className="text-red-400">- {stats.totalExpenses.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Inventory value</span>
                        <span className="text-blue-400">{stats.totalInventory.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Pending repairs</span>
                        <span className="text-yellow-400">{stats.pendingRepairs} jobs</span>
                    </div>
                    <hr className="border-gray-700" />
                    <div className="flex justify-between font-bold">
                        <span className="text-white">Net Worth</span>
                        <span className="text-purple-400">{netWorth.toLocaleString()} DA</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard