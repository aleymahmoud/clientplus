// components/data-entry/DataEntryForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Save, Plus } from 'lucide-react'

const entrySchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  subdomain: z.string().min(1, 'Subdomain is required'),
  scope: z.string().min(1, 'Scope is required'),
  client: z.string().min(1, 'Client is required'),
  workingHours: z.number().min(0.25, 'Minimum 0.25 hours').max(24, 'Maximum 24 hours'),
  notes: z.string().min(1, 'Notes are required'),
})

type EntryFormData = z.infer<typeof entrySchema>

export default function DataEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      workingHours: 1,
    },
  })

  const selectedDomain = watch('domain')
  const selectedSubdomain = watch('subdomain')

  const onSubmit = async (data: EntryFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: API call to save entry
      console.log('Saving entry:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form after successful save
      reset()
      
      // TODO: Refresh today's entries
      alert('Entry saved successfully!')
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Error saving entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Time Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Domain Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Select
              onValueChange={(value) => {
                setValue('domain', value)
                setValue('subdomain', '') // Reset subdomain when domain changes
                setValue('scope', '') // Reset scope when domain changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain..." />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: Replace with dynamic data */}
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="academy">Academy</SelectItem>
                <SelectItem value="business-development">Business Development</SelectItem>
              </SelectContent>
            </Select>
            {errors.domain && (
              <p className="text-sm text-red-500">{errors.domain.message}</p>
            )}
          </div>

          {/* Subdomain Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomain *</Label>
            <Select
              onValueChange={(value) => {
                setValue('subdomain', value)
                setValue('scope', '') // Reset scope when subdomain changes
              }}
              disabled={!selectedDomain}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedDomain ? "Select subdomain..." : "Select domain first"} />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: Replace with dynamic data based on selected domain */}
                {selectedDomain === 'consulting' && (
                  <>
                    <SelectItem value="cyber-talents">Cyber Talents</SelectItem>
                    <SelectItem value="elabd">ElAbd</SelectItem>
                    <SelectItem value="wander">Wander</SelectItem>
                    <SelectItem value="raya-trade">Raya Trade</SelectItem>
                  </>
                )}
                {selectedDomain === 'marketing' && (
                  <>
                    <SelectItem value="forefront">Forefront</SelectItem>
                    <SelectItem value="team-internal">Team Internal</SelectItem>
                  </>
                )}
                {/* Add more domains as needed */}
              </SelectContent>
            </Select>
            {errors.subdomain && (
              <p className="text-sm text-red-500">{errors.subdomain.message}</p>
            )}
          </div>

          {/* Scope Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="scope">Scope *</Label>
            <Select
              onValueChange={(value) => setValue('scope', value)}
              disabled={!selectedSubdomain}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedSubdomain ? "Select scope..." : "Select subdomain first"} />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: Replace with dynamic data based on selected subdomain */}
                <SelectItem value="data-analytics-bi">Data Analytics - BI</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="alignment-meeting">Alignment Meeting</SelectItem>
                <SelectItem value="preparation">Preparation</SelectItem>
              </SelectContent>
            </Select>
            {errors.scope && (
              <p className="text-sm text-red-500">{errors.scope.message}</p>
            )}
          </div>

          {/* Client Input */}
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Input
              id="client"
              {...register('client')}
              placeholder="Enter client name..."
            />
            {errors.client && (
              <p className="text-sm text-red-500">{errors.client.message}</p>
            )}
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <Label htmlFor="workingHours">Working Hours *</Label>
            <Input
              id="workingHours"
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              {...register('workingHours', { valueAsNumber: true })}
              placeholder="e.g., 2.5"
            />
            {errors.workingHours && (
              <p className="text-sm text-red-500">{errors.workingHours.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Describe the work performed..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}