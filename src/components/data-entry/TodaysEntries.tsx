// components/data-entry/TodaysEntries.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Clock } from 'lucide-react'

// Mock data - TODO: Replace with real data from API
const mockTodaysEntries = [
  {
    id: 1,
    domain: 'Consulting',
    subdomain: 'Wander',
    scope: 'Data Analytics - BI',
    client: 'Wander',
    workingHours: 3,
    notes: 'Directions dashboard update',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    domain: 'Marketing',
    subdomain: 'Forefront',
    scope: 'Strategy',
    client: 'FFNT',
    workingHours: 1.5,
    notes: 'Marketing alignment meeting',
    createdAt: new Date().toISOString(),
  },
]

export default function TodaysEntries() {
  const [entries] = useState(mockTodaysEntries)

  const totalHours = entries.reduce((sum, entry) => sum + entry.workingHours, 0)

  const handleEdit = (entryId: number) => {
    // TODO: Open edit modal or navigate to edit form
    console.log('Edit entry:', entryId)
    alert(`Edit entry ${entryId} - Feature coming soon!`)
  }

  const handleDelete = (entryId: number) => {
    // TODO: Show confirmation dialog and delete entry
    console.log('Delete entry:', entryId)
    if (confirm('Are you sure you want to delete this entry?')) {
      alert(`Delete entry ${entryId} - Feature coming soon!`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Entries
          </span>
          <Badge variant="outline" className="text-sm">
            {totalHours}h total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No entries for today yet.</p>
            <p className="text-sm">Add your first entry using the form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                {/* Entry Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{entry.domain}</span>
                      <span>→</span>
                      <span>{entry.subdomain}</span>
                      <span>→</span>
                      <span>{entry.scope}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {entry.client}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entry.workingHours}h
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(entry.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(entry.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Entry Notes */}
                <div className="text-sm text-muted-foreground">
                  <p>{entry.notes}</p>
                </div>

                {/* Entry Time */}
                <div className="text-xs text-muted-foreground">
                  Added at {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}

            {/* Daily Summary */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Daily Total:</span>
                <Badge className="text-sm">
                  {totalHours} hours
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}