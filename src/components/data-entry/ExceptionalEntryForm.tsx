// src/components/data-entry/ExceptionalEntryForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Save, Calendar } from 'lucide-react'

interface Domain {
  id: number
  domainName: string
}

interface Subdomain {
  id: number
  subdomainName: string
  leadConsultant: string
}

interface Scope {
  id: number
  scopeName: string
  createdBy: string
}

interface TimeEntry {
  id: number
  date: string
  domainId: number
  domainName: string
  subdomainId: number
  subdomainName: string
  scopeId: number
  scopeName: string
  hours: number
  notes: string
}

type EntryFormData = Omit<TimeEntry, 'id'>

export default function ExceptionalEntryForm({ onEntriesUpdated }: { onEntriesUpdated?: () => void }) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [subdomainsMap, setSubdomainsMap] = useState<Record<number, Subdomain[]>>({})
  const [scopesMap, setScopesMap] = useState<Record<number, Scope[]>>({})
  
  const [entries, setEntries] = useState<TimeEntry[]>([
    { 
      id: 1, 
      date: new Date().toISOString().split('T')[0], // Default to today
      domainId: 0, 
      domainName: '', 
      subdomainId: 0, 
      subdomainName: '', 
      scopeId: 0, 
      scopeName: '', 
      hours: 0, 
      notes: '' 
    }
  ])
  const [nextId, setNextId] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains')
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText)
        toast.error('Failed to load domains')
        setLoading(false)
        return
      }
      
      const data = await response.json()
      console.log('Domains API response:', data)
      
      if (Array.isArray(data)) {
        setDomains(data)
      } else {
        console.error('Expected array of domains, got:', data)
        toast.error('Invalid domains data format')
        setDomains([])
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
      toast.error('Error loading domains')
      setDomains([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSubdomains = async (domainId: number) => {
    try {
      const response = await fetch(`/api/subdomains/${domainId}`)
      if (response.ok) {
        const data = await response.json()
        setSubdomainsMap(prev => ({
          ...prev,
          [domainId]: data
        }))
      } else {
        toast.error('Failed to load subdomains')
      }
    } catch (error) {
      console.error('Error fetching subdomains:', error)
      toast.error('Error loading subdomains')
    }
  }

  const fetchScopes = async (subdomainId: number) => {
    try {
      const response = await fetch(`/api/scopes/${subdomainId}`)
      if (response.ok) {
        const data = await response.json()
        setScopesMap(prev => ({
          ...prev,
          [subdomainId]: data
        }))
      } else {
        toast.error('Failed to load scopes')
      }
    } catch (error) {
      console.error('Error fetching scopes:', error)
      toast.error('Error loading scopes')
    }
  }

  const addEntry = () => {
    const newEntry: TimeEntry = {
      id: nextId,
      date: new Date().toISOString().split('T')[0],
      domainId: 0,
      domainName: '',
      subdomainId: 0,
      subdomainName: '',
      scopeId: 0,
      scopeName: '',
      hours: 0,
      notes: ''
    }
    setNextId(nextId + 1)
    setEntries([newEntry, ...entries])
    toast.success('New entry added')
  }

  const deleteEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id))
      toast.success('Entry removed')
    } else {
      toast.warning('Cannot delete the last entry')
    }
  }

  const updateEntry = (id: number, field: keyof EntryFormData, value: string | number) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry }
        
        if (field === 'domainId') {
          const domain = domains.find(d => d.id === value)
          updated.domainId = value as number
          updated.domainName = domain?.domainName || ''
          updated.subdomainId = 0
          updated.subdomainName = ''
          updated.scopeId = 0
          updated.scopeName = ''
          fetchSubdomains(value as number)
        } else if (field === 'subdomainId') {
          const subdomain = subdomainsMap[updated.domainId]?.find(s => s.id === value)
          updated.subdomainId = value as number
          updated.subdomainName = subdomain?.subdomainName || ''
          updated.scopeId = 0
          updated.scopeName = ''
          fetchScopes(value as number)
        } else if (field === 'scopeId') {
          const scope = scopesMap[updated.subdomainId]?.find(s => s.id === value)
          updated.scopeId = value as number
          updated.scopeName = scope?.scopeName || ''
        } else {
          (updated as any)[field] = value
        }
        
        return updated
      }
      return entry
    }))
  }

  const submitAll = async () => {
    const validationErrors: string[] = []
    const validEntries = entries.filter((entry, index) => {
      const errors: string[] = []
      
      if (!entry.date) errors.push(`Entry ${index + 1}: Date is required`)
      if (new Date(entry.date) > new Date()) errors.push(`Entry ${index + 1}: Date cannot be in the future`)
      if (entry.domainId <= 0) errors.push(`Entry ${index + 1}: Domain is required`)
      if (entry.subdomainId <= 0) errors.push(`Entry ${index + 1}: Subdomain is required`)
      if (entry.scopeId <= 0) errors.push(`Entry ${index + 1}: Scope is required`)
      if (entry.hours <= 0) errors.push(`Entry ${index + 1}: Hours must be greater than 0`)
      if (!entry.notes.trim()) errors.push(`Entry ${index + 1}: Notes are required`)
      
      if (errors.length > 0) {
        validationErrors.push(...errors)
        return false
      }
      return true
    })

    if (validationErrors.length > 0) {
      toast.error(`Validation errors:\n${validationErrors.join('\n')}`)
      return
    }

    if (validEntries.length === 0) {
      toast.warning('No valid entries to submit')
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Submitting exceptional entries:', validEntries)
      
      // Transform data to match API expectations - with custom date and source
      const apiEntries = validEntries.map(entry => ({
        date: entry.date,
        domain: entry.domainName,
        subdomain: entry.subdomainName,
        scope: entry.scopeName,
        hours: entry.hours,
        notes: entry.notes,
        source: 'Exceptional Entry' // Mark as exceptional entry
      }))

      const response = await fetch('/api/entries/exceptional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries: apiEntries }),
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok) {
        toast.success(`${validEntries.length} exceptional entries saved successfully!`)
        
        // Reset form after successful submission
        setEntries([{
          id: 1,
          date: new Date().toISOString().split('T')[0],
          domainId: 0,
          domainName: '',
          subdomainId: 0,
          subdomainName: '',
          scopeId: 0,
          scopeName: '',
          hours: 0,
          notes: ''
        }])
        setNextId(2)

        if (onEntriesUpdated) {
          onEntriesUpdated()
        }
      } else {
        toast.error(`Failed to save entries: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error submitting entries:', error)
      toast.error('Network error while saving entries')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading form...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Exceptional Entries
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button onClick={addEntry} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Entry
          </Button>
          <Button 
            onClick={submitAll} 
            disabled={isSubmitting} 
            size="sm"
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSubmitting ? 'Submitting...' : 'Submit All'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {entries.map((entry, index) => (
          <div key={entry.id} className="space-y-4 p-4 border rounded-lg border-orange-200 bg-orange-50/30">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-orange-900">Exceptional Entry {index + 1}</h4>
              {entries.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Date Selection - First and prominent */}
            <div className="space-y-2">
              <Label className="text-orange-900 font-medium">Entry Date *</Label>
              <Input
                type="date"
                value={entry.date}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            {/* Domain Selection - Button Group */}
            <div className="space-y-2">
              <Label className="text-orange-900">Domain *</Label>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(domains) && domains.map((domain) => (
                  <Button
                    key={domain.id}
                    variant={entry.domainId === domain.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateEntry(entry.id, 'domainId', domain.id)}
                    className={entry.domainId === domain.id ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    {domain.domainName}
                  </Button>
                ))}
                {!Array.isArray(domains) && (
                  <div className="text-sm text-red-500">Error loading domains</div>
                )}
              </div>
            </div>

            {/* Client/Subdomain Dropdown */}
            <div className="space-y-2">
              <Label className="text-orange-900">Client/Subdomain *</Label>
              <Select
                value={entry.subdomainId.toString()}
                onValueChange={(value) => updateEntry(entry.id, 'subdomainId', parseInt(value))}
                disabled={!entry.domainId}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder={entry.domainId ? "Select client/subdomain..." : "Select domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {entry.domainId && Array.isArray(subdomainsMap[entry.domainId]) && subdomainsMap[entry.domainId].map((subdomain) => (
                    <SelectItem key={subdomain.id} value={subdomain.id.toString()}>
                      {subdomain.subdomainName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scope Dropdown */}
            <div className="space-y-2">
              <Label className="text-orange-900">Scope *</Label>
              <Select
                value={entry.scopeId.toString()}
                onValueChange={(value) => updateEntry(entry.id, 'scopeId', parseInt(value))}
                disabled={!entry.subdomainId}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder={entry.subdomainId ? "Select scope..." : "Select subdomain first"} />
                </SelectTrigger>
                <SelectContent>
                  {entry.subdomainId && Array.isArray(scopesMap[entry.subdomainId]) && scopesMap[entry.subdomainId].map((scope) => (
                    <SelectItem key={scope.id} value={scope.id.toString()}>
                      {scope.scopeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hours and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-orange-900">Hours *</Label>
                <Input
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  value={entry.hours || ''}
                  onChange={(e) => updateEntry(entry.id, 'hours', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 2.5"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-orange-900">Notes *</Label>
                <Textarea
                  value={entry.notes}
                  onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                  placeholder="Describe the work performed..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}