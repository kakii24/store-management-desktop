import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Repairs from './pages/Repairs'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import Currencies from './pages/Currencies'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />
      case 'inventory': return <Inventory />
      case 'repairs': return <Repairs />
      case 'income': return <Income />
      case 'expenses': return <Expenses />
      case 'currencies': return <Currencies />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="ml-64 flex-1 p-6">
        {renderPage()}
      </main>
    </div>
  )
}

export default App