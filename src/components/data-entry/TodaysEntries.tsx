// components/data-entry/TodaysEntries.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export default function TodaysEntries() {
  const [entries, setEntries] = useState<TodayEntry[]>([])
  const [loading, setLoading] = useState(true)

  // State variables
  const [editingEntry, setEditingEntry] = useState<TodayEntry | null>(null)
  const [editForm, setEditForm] = useState({
    hours: 0,
    notes: '',
    domainId: 0,
    domainName: '',
    subdomainId: 0,
    subdomainName: '',
    scopeId: 0,
    scopeName: '',
  })
  const [savingEntryId, setSavingEntryId] = useState<number | null>(null)
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null)
  const [editForms, setEditForms] = useState<Record<number, any>>({})

  // Add new state for dropdowns
  const [domains, setDomains] = useState<any[]>([])
  const [subdomains, setSubdomains] = useState<any[]>([])
  const [scopes, setScopes] = useState<any[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(false)


const handleStartInlineEdit = async (entry: TodayEntry) => {
  setLoadingDropdowns(true)
  
  // Load domains first
  await fetchDomains()
  
  // Find the current domain to load its subdomains
  const response = await fetch('/api/domains')
  if (response.ok) {
    const domainsData = await response.json()
    const currentDomain = domainsData.find((d: any) => d.domainName === entry.domain)
    
    if (currentDomain) {
      // Load subdomains for current domain
      await fetchSubdomains(currentDomain.id)
      
      // Load subdomains to find current subdomain
      const subResponse = await fetch(`/api/subdomains/${currentDomain.id}`)
      if (subResponse.ok) {
        const subdomainsData = await subResponse.json()
        const currentSubdomain = subdomainsData.find((s: any) => s.subdomainName === entry.subdomain)
        
        if (currentSubdomain) {
          // Load scopes for current subdomain
          await fetchScopes(currentSubdomain.id)
        }
      }
    }
  }
  



  setLoadingDropdowns(false)
  
  // Now set editing state with preloaded data
  setEditingEntryId(entry.id)
  setEditForms({
    ...editForms,
    [entry.id]: {
      hours: entry.hours,
      notes: entry.notes,
      domainName: entry.domain,
      subdomainName: entry.subdomain,
      scopeName: entry.scope,
    }
  })
}

const handleCancelInlineEdit = (entryId: number) => {
  setEditingEntryId(null)
  const newForms = {...editForms}
  delete newForms[entryId]
  setEditForms(newForms)
  setSubdomains([])
  setScopes([])
}

const updateInlineForm = (entryId: number, field: string, value: any) => {
  console.log('Updating form:', { entryId, field, value })
  console.log('Current editForms before update:', editForms)
  
  const newForms = {
    ...editForms,
    [entryId]: {
      ...editForms[entryId],
      [field]: value
    }
  }
  
  console.log('New editForms after update:', newForms)
  setEditForms(newForms)
}




  useEffect(() => {
    fetchTodaysEntries()
  }, [])

  const fetchTodaysEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/today')
      
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      } else {
        console.error('Failed to fetch today\'s entries')
      }
    } catch (error) {
      console.error('Error fetching today\'s entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains')
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
    }
  }

  const fetchSubdomains = async (domainId: number) => {
    try {
      const response = await fetch(`/api/subdomains/${domainId}`)
      if (response.ok) {
        const data = await response.json()
        setSubdomains(data)
      }
    } catch (error) {
      console.error('Error fetching subdomains:', error)
    }
  }

  const fetchScopes = async (subdomainId: number) => {
    try {
      const response = await fetch(`/api/scopes/${subdomainId}`)
      if (response.ok) {
        const data = await response.json()
        setScopes(data)
      }
    } catch (error) {
      console.error('Error fetching scopes:', error)
    }
  }

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)

  const handleEdit = async (entry: TodayEntry) => {
    setEditingEntry(entry)
    setEditForm({
      hours: entry.hours,
      notes: entry.notes,
      domainId: 0,
      domainName: entry.domain,
      subdomainId: 0,
      subdomainName: entry.subdomain,
      scopeId: 0,
      scopeName: entry.scope,
    })
    
    // Load dropdown data
    setLoadingDropdowns(true)
    await fetchDomains()
    setLoadingDropdowns(false)
  }

const handleSaveInlineEdit = async (entryId: number) => {
  const editForm = editForms[entryId]
  if (!editForm) return

  try {
    setSavingEntryId(entryId)  // Set this specific entry as saving
    const response = await fetch(`/api/entries/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hours: editForm.hours,
        notes: editForm.notes,
        domain: editForm.domainName,
        subdomain: editForm.subdomainName,
        scope: editForm.scopeName,
      }),
    })

    if (response.ok) {
      await fetchTodaysEntries()
      handleCancelInlineEdit(entryId)
    } else {
      alert('Failed to update entry')
    }
  } catch (error) {
    console.error('Error updating entry:', error)
    alert('Error updating entry')
  } finally {
    setSavingEntryId(null)  // Clear saving state
  }
}

  const handleDelete = async (entryId: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/entries/${entryId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchTodaysEntries()
        } else {
          alert('Failed to delete entry')
        }
      } catch (error) {
        console.error('Error deleting entry:', error)
        alert('Error deleting entry')
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    )
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

{entries.map((entry) => {
  const isEditing = editingEntryId === entry.id
  const editForm = editForms[entry.id] || {}
  
  return (
    <div
      key={entry.id}
      className={`border rounded-lg p-4 space-y-3 transition-colors ${
        isEditing ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
      }`}
    >
      {isEditing ? (
        // EDITING MODE - Inline Form
// EDITING MODE - Full Inline Form with Dropdowns
<div className="space-y-4">
{/* Domain Selection */}
<div className="space-y-2">
  <Label>Domain</Label>
  {loadingDropdowns ? (
    <div className="text-sm text-muted-foreground">Loading domains...</div>
  ) : (
<Select
  value={editForm.domainName || ''}
  onValueChange={async (domainName) => {
    console.log('Domain selected:', domainName)
    console.log('Current editForm before update:', editForm)
    
    const domain = domains.find(d => d.domainName === domainName)
    updateInlineForm(entry.id, 'domainName', domainName)
    updateInlineForm(entry.id, 'subdomainName', '')
    updateInlineForm(entry.id, 'scopeName', '')
    setSubdomains([])
    setScopes([])
    if (domain) {
      await fetchSubdomains(domain.id)
    }
  }}
>
  <SelectTrigger className="max-w-48">
    <SelectValue placeholder={`Select domain (current: ${editForm.domainName || 'none'})`} />
  </SelectTrigger>
  <SelectContent>
    {domains.map((domain) => (
      <SelectItem key={domain.id} value={domain.domainName}>
        {domain.domainName}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
  )}
</div>

  {/* Subdomain Selection */}
  <div className="space-y-2">
    <Label>Subdomain</Label>
    <Select
      value={editForm.subdomainName || ''}
      onValueChange={async (subdomainName) => {
        const subdomain = subdomains.find(s => s.subdomainName === subdomainName)
        updateInlineForm(entry.id, 'subdomainName', subdomainName)
        updateInlineForm(entry.id, 'scopeName', '')
        setScopes([])
        if (subdomain) {
          await fetchScopes(subdomain.id)
        }
      }}
      disabled={!editForm.domainName}
    >
      <SelectTrigger className="max-w-48">
        <SelectValue placeholder={editForm.domainName ? "Select subdomain" : "Select domain first"} />
      </SelectTrigger>
      <SelectContent>
        {subdomains.map((subdomain) => (
          <SelectItem key={subdomain.id} value={subdomain.subdomainName}>
            {subdomain.subdomainName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Scope Selection */}
  <div className="space-y-2">
    <Label>Scope</Label>
    <Select
      value={editForm.scopeName || ''}
      onValueChange={(scopeName) => {
        updateInlineForm(entry.id, 'scopeName', scopeName)
      }}
      disabled={!editForm.subdomainName}
    >
      <SelectTrigger className="max-w-48">
        <SelectValue placeholder={editForm.subdomainName ? "Select scope" : "Select subdomain first"} />
      </SelectTrigger>
      <SelectContent>
        {scopes.map((scope) => (
          <SelectItem key={scope.id} value={scope.scopeName}>
            {scope.scopeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Hours Input */}
  <div className="space-y-2">
    <Label>Hours</Label>
    <Input
      type="number"
      step="0.25"
      min="0"
      max="24"
      value={editForm.hours || 0}
      onChange={(e) => updateInlineForm(entry.id, 'hours', parseFloat(e.target.value) || 0)}
      className="max-w-32"
    />
  </div>

  {/* Notes Input */}
  <div className="space-y-2">
    <Label>Notes</Label>
    <Textarea
      value={editForm.notes || ''}
      onChange={(e) => updateInlineForm(entry.id, 'notes', e.target.value)}
      rows={2}
    />
  </div>

  {/* Save/Cancel Buttons */}
  <div className="flex gap-2">
    <Button 
      onClick={() => handleSaveInlineEdit(entry.id)} 
      disabled={savingEntryId === entry.id || loadingDropdowns}
      size="sm"
    >
      {savingEntryId === entry.id ? 'Saving...' : 'Save'}
    </Button>
    <Button 
      variant="outline" 
      onClick={() => handleCancelInlineEdit(entry.id)}
      size="sm"
    >
      Cancel
    </Button>
  </div>
</div>
      ) : (
        // DISPLAY MODE - Normal Entry
        <>
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
                  {entry.hours}h
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStartInlineEdit(entry)}
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

          <div className="text-sm text-muted-foreground">
            <p>{entry.notes}</p>
          </div>

          <div className="text-xs text-muted-foreground">
            Added at {new Date(entry.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </>
      )}
    </div>
  )
}
            
            )}

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