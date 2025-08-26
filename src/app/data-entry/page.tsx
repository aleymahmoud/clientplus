// app/data-entry/page.tsx
import { Metadata } from 'next'
import DataEntryForm from '@/components/data-entry/DataEntryForm'
import TodaysEntries from '@/components/data-entry/TodaysEntries'

export const metadata: Metadata = {
  title: 'Data Entry - ClientPlus',
  description: 'Enter your daily work hours and activities',
}

export default function DataEntryPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Entry</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Data Entry Form */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add New Entry</h2>
          <DataEntryForm />
        </div>

        {/* Today's Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Today's Entries</h2>
          <TodaysEntries />
        </div>
      </div>
    </div>
  )
}