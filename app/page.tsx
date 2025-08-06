"use client"

import { useState, useMemo } from "react"
import { mockSimulations, type Simulation } from "@/data/mock-simulations" // Updated import
import { AssessorSidebar } from "@/components/assessor-sidebar"
import { AssessorHeader } from "@/components/assessor-header"
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react" // Removed ChevronDown, Edit, Link
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Keep for search input
import { Table, TableRow, TableCell } from "@/components/ui/table" // Keep for table

export default function AssessorDashboard() {
  const [simulations] = useState<Simulation[]>(mockSimulations) // Changed to simulations
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filter simulations based on search term
  const filteredSimulations = useMemo(() => {
    return simulations.filter((simulation) => {
      const matchesSearch = simulation.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [simulations, searchTerm])

  // Pagination logic
  const totalItems = filteredSimulations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSimulations = filteredSimulations.slice(startIndex, endIndex)

  const getStatusBadge = (status: Simulation["status"]) => {
    const styles = {
      Draft: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Published: "bg-green-100 text-green-800",
      Archived: "bg-red-100 text-red-800",
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Sidebar */}
      <AssessorSidebar />
      {/* Main Content */}
      <div className="pl-24">
        {/* Top Header */}
        <AssessorHeader />
        {/* Page Content */}
        <div className="p-6 mr-6 bg-white border border-gray-200 rounded-lg">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Simulation Builder</h1>
              <p className="text-gray-600">Manage and create HR assessment simulations.</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-800 cursor-pointer" onClick={() => (window.location.href = "/canvas")}>
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </div>
          {/* Search Bar */}
          <div className="mb-6 grid">
            <div className="relative col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search simulations..." // Updated placeholder
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Simulations Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="overflow-hidden">
              <Table>
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-900 text-sm">Simulation Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSimulations.map(
                    (
                      simulation, // Changed to simulation
                    ) => (
                      <TableRow key={simulation.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">{simulation.name}</div>
                        </TableCell>
                        <TableCell className="py-4 px-6">{getStatusBadge(simulation.status)}</TableCell>
                      </TableRow>
                    ),
                  )}
                </tbody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} simulations{" "}
                {/* Updated text */}
              </div>
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? "bg-gray-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {page}
                  </button>
                ))}
                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
                {/* Items per page dropdown */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="ml-4 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
