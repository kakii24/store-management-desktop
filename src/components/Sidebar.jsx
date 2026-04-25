const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'repairs', label: 'Repairs', icon: '🔧' },
    { id: 'income', label: 'Income', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'currencies', label: 'Currencies', icon: '💱' },
]

function Sidebar({ activePage, setActivePage }) {

    return (
        <div className="w-64 h-screen bg-gray-800 flex flex-col p-4 fixed left-0 top-0">

            {/*App name*/}
            <h1 className="text-white text-2xl font-bold mb-8 text-center">Gestion Store</h1>

            {/*navigation links */}
            <nav className="flex flex-col gap-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                            ${activePage === item.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>


                    </button>
                ))}
            </nav>

        </div>
    )
}
export default Sidebar