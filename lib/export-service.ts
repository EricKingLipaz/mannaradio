// Export service for converting data to CSV and Excel formats

export interface ExportOptions {
  format: "csv" | "xlsx"
  filename?: string
}

export function generateCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return ""

  // Get headers from first object
  const headers = Object.keys(data[0])
  const headerRow = headers.map((h) => `"${h}"`).join(",")

  // Generate rows
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header]
        if (value === null || value === undefined) return '""'
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return `"${value}"`
      })
      .join(","),
  )

  return [headerRow, ...rows].join("\n")
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function downloadXLSX(data: Record<string, any>[], filename: string) {
  // Dynamic import for xlsx to reduce bundle size
  const XLSX = await import("xlsx")

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members")

  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map(() => 15)
  worksheet["!cols"] = colWidths.map((width) => ({ wch: width }))

  XLSX.writeFile(workbook, filename)
}

export function formatMembersForExport(members: any[]) {
  return members.map((member) => ({
    "Full Name": member.full_name,
    Email: member.email,
    Phone: member.phone,
    Address: member.address,
    "Date of Birth": member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : "N/A",
    "Baptism Date": member.baptism_date ? new Date(member.baptism_date).toLocaleDateString() : "Not Baptized",
    Rank: member.rank,
    "Joined Date": new Date(member.created_at).toLocaleDateString(),
  }))
}
