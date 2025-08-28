// src/components/dashboard/EntryModals.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, FileText } from 'lucide-react'

interface TodayEntry {
  id: number
  client: string
  domain: string
  subdomain: string
  scope: string
  hours: number
  notes: string
  createdAt: string
}

interface EntryModalProps {
  entry: TodayEntry | null
  isOpen: boolean
  mode: 'view' | 'edit'
  onClose: () => void
  onSave?: (updatedEntry: TodayEntry) => void
  onRefresh?: () => void
}

export default function EntryModal({ 
  entry, 
  isOpen, 
  mode, 
  onClose, 
  onSave, 
  onRefresh 
}: EntryModalProps) {
  const [editedEntry, setEditedEntry] = useState<TodayEntry | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [domains, setDomains] = useState<any[]>([])
  const [subdomains, setSubdomains] = useState<any[]>([])
  const [scopes, setScopes] = useState<any[]>([])

  // Initialize edited entry when entry changes
  useEffect(() => {
    if (entry) {
      setEditedEntry({ ...entry })
    }
  }, [entry])

  // Load dropdown data for edit mode
  useEffect(() => {
    if (mode === 'edit' && isOpen) {
      loadDropdownData()
    }
  }, [mode, isOpen])

  const loadDropdownData = async () => {
    try {
      // Load domains
      const domainsRes = await fetch('/api/domains')
      if (domainsRes.ok) {
        const domainsData = await domainsRes.json()
        setDomains(domainsData)

        // Find current domain and load subdomains
        const currentDomain = domainsData.find((d: any) => d.domainName === entry?.domain)
        if (currentDomain) {
          const subdomainsRes = await fetch(`/api/subdomains/${currentDomain.id}`)
          if (subdomainsRes.ok) {
            const subdomainsData = await subdomainsRes.json()
            setSubdomains(subdomainsData)

            // Find current subdomain and load scopes
            const currentSubdomain = subdomainsData.find((s: any) => s.subdomainName === entry?.subdomain)
            if (currentSubdomain) {
              const scopesRes = await fetch(`/api/scopes/${currentSubdomain.id}`)
              if (scopesRes.ok) {
                const scopesData = await scopesRes.json()
                setScopes(scopesData)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error)
      toast.error('Failed to load form data')
    }
  }

  const handleSave = async () => {
    if (!editedEntry) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/entries/${editedEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hours: editedEntry.hours,
          notes: editedEntry.notes,
          domain: editedEntry.domain,
          subdomain: editedEntry.subdomain,
          scope: editedEntry.scope
        })
      })

      if (response.ok) {
        toast.success('Entry updated successfully!')
        onSave?.(editedEntry)
        onRefresh?.()
        onClose()
      } else {
        const error = await response.json()
        toast.error(`Failed to update entry: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating entry:', error)
      toast.error('Network error while updating entry')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!entry) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'view' ? (
              <>
                <FileText className="h-5 w-5" />
                Entry Details
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Edit Entry
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'View complete entry information'
              : 'Update your time entry details'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'view' ? (
            // VIEW MODE
            <>
              {/* Entry Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Client</Label>
                  <p className="font-medium">{entry.client}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Hours</Label>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span className="font-semibold text-blue-600">{entry.hours}h</span>
                  </div>
                </div>
              </div>

              {/* Domain Chain */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Service Path</Label>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{entry.domain}</Badge>
                  <span className="text-gray-400">→</span>
                  <Badge variant="outline" className="text-xs">{entry.subdomain}</Badge>
                  <span className="text-gray-400">→</span>
                  <Badge variant="outline" className="text-xs">{entry.scope}</Badge>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Notes</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {entry.notes || 'No notes provided'}
                </p>
              </div>

              {/* Created At */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Created</Label>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span>{formatDateTime(entry.createdAt)}</span>
                </div>
              </div>
            </>
          ) : (
            // EDIT MODE
            editedEntry && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hours</Label>
                    <Input
                      type="number"
                      step="0.25"
                      min="0"
                      max="24"
                      value={editedEntry.hours}
                      onChange={(e) => setEditedEntry({
                        ...editedEntry,
                        hours: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Input
                      value={editedEntry.client}
                      onChange={(e) => setEditedEntry({
                        ...editedEntry,
                        client: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editedEntry.notes}
                    onChange={(e) => setEditedEntry({
                      ...editedEntry,
                      notes: e.target.value
                    })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={onClose} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </>
            )
          )}

          {mode === 'view' && (
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}