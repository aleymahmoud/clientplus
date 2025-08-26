// src/components/data-entry/DataEntryForm.tsx
'use client'

import { useState, useEffect } from 'react'
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
import { Plus, X, Save } from 'lucide-react'

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

export default function DataEntryForm() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [subdomainsMap, setSubdomainsMap] = useState<Record<number, Subdomain[]>>({})
  const [scopesMap, setScopesMap] = useState<Record<number, Scope[]>>({})
  
  const [entries, setEntries] = useState<TimeEntry[]>([
    { 
      id: 1, 
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
        return
      }
      
      const data = await response.json()
      console.log('Domains data:', data) // Debug log
      
      if (Array.isArray(data)) {
        setDomains(data)
      } else if (data.error) {
        console.error('API returned error:', data.error)
      } else {
        console.error('Unexpected data format:', data)
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
        // Fallback to mock data for now
/*
        setDomains([
    { domainID: 1, domainName: 'Consulting' },
    { domainID: 2, domainName: 'Marketing' },
    { domainID: 3, domainName: 'Community' },
    { domainID: 4, domainName: 'Academy' },
    { domainID: 5, domainName: 'Business Development' }
  ])
*/

    } finally {
      setLoading(false)
    }
  }

const fetchSubdomains = async (domainId: number) => {
  if (subdomainsMap[domainId]) return // Already cached
  
  try {
    console.log('Fetching subdomains for domain:', domainId)
    const response = await fetch(`/api/subdomains/${domainId}`)
    console.log('Subdomain response:', response.status)
    const data = await response.json()
    console.log('Subdomain data:', data)
    
    if (data.error) {
      console.error('API returned error:', data.error)
      return
    }
    
    setSubdomainsMap(prev => ({ ...prev, [domainId]: data }))
  } catch (error) {
    console.error('Error fetching subdomains:', error)
  }
}

  const fetchScopes = async (subdomainId: number) => {
    if (scopesMap[subdomainId]) return // Already cached
    
    try {
      const response = await fetch(`/api/scopes/${subdomainId}`)
      const data = await response.json()
      setScopesMap(prev => ({ ...prev, [subdomainId]: data }))
    } catch (error) {
      console.error('Error fetching scopes:', error)
    }
  }

  const addEntry = () => {
    const newEntry: TimeEntry = {
      id: nextId,
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
  }

  const deleteEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id))
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
          // Fetch subdomains for this domain
          fetchSubdomains(value as number)
        } else if (field === 'subdomainId') {
          const subdomain = subdomainsMap[updated.domainId]?.find(s => s.id === value)
          updated.subdomainId = value as number
          updated.subdomainName = subdomain?.subdomainName || ''
          updated.scopeId = 0
          updated.scopeName = ''
          // Fetch scopes for this subdomain
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
    const validEntries = entries.filter(entry => 
        entry.domainId > 0 && entry.subdomainId > 0 && entry.scopeId > 0 && entry.hours > 0 && entry.notes
    )
    
    if (validEntries.length === 0) {
      alert('Please fill at least one complete entry')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entries: validEntries.map(entry => ({
            domain: entry.domainName,
            subdomain: entry.subdomainName,
            scope: entry.scopeName,
            hours: entry.hours,
            notes: entry.notes
          }))
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setEntries([{ 
          id: nextId, 
          domainId: 0, 
          domainName: '', 
          subdomainId: 0, 
          subdomainName: '', 
          scopeId: 0, 
          scopeName: '', 
          hours: 0, 
          notes: '' 
        }])
        setNextId(nextId + 1)
        alert(result.message)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save entries')
      }
    } catch (error) {
      console.error('Error saving entries:', error)
      alert('Error saving entries. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Time Entries
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
            <Plus className="h-5 w-5" />
            Time Entries
          </span>
          <div className="flex gap-2">
            <Button onClick={addEntry} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Entry
            </Button>
            <Button 
              onClick={submitAll} 
              disabled={isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Submit All
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {entries.map((entry, index) => (
          <div key={entry.id} className="border rounded-lg p-4 space-y-4">
            {/* Entry Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Entry {index + 1}</h4>
              {entries.length > 1 && (
                <Button
                  onClick={() => deleteEntry(entry.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              )}
            </div>

            {/* Domain Buttons */}
            <div className="space-y-2">
              <Label>Domain *</Label>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(domains) && domains.map((domain) => (
                  <Button
                    key={domain.id}
                    variant={entry.domainId === domain.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateEntry(entry.id, 'domainId', domain.id)}
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
              <Label>Client/Subdomain *</Label>
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
              <Label>Scope *</Label>
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
                <Label>Hours *</Label>
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
                <Label>Notes *</Label>
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