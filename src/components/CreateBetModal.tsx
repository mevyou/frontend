'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { X, Calendar, DollarSign, FileText } from 'lucide-react'
import { useCreateBet } from '@/hooks/useBetting'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface CreateBetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateBetModal({ isOpen, onClose, onSuccess }: CreateBetModalProps) {
  const { isConnected } = useAccount()
  const { createBet, isPending, isSuccess } = useCreateBet()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    deadline: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isSuccess) {
      toast.success('Bet created successfully!')
      onSuccess()
      resetForm()
    }
  }, [isSuccess, onSuccess])

  const resetForm = () => {
    setFormData({ description: '', amount: '', deadline: '' })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number'
      } else if (amount < 0.001) {
        newErrors.amount = 'Minimum amount is 0.001 ETH'
      } else if (amount > 100) {
        newErrors.amount = 'Maximum amount is 100 ETH'
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required'
    } else {
      const deadline = new Date(formData.deadline)
      const now = new Date()
      const minDeadline = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
      const maxDeadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

      if (deadline <= minDeadline) {
        newErrors.deadline = 'Deadline must be at least 1 hour from now'
      } else if (deadline > maxDeadline) {
        newErrors.deadline = 'Deadline cannot be more than 30 days from now'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    if (!validateForm()) {
      return
    }

    const deadline = new Date(formData.deadline).getTime()
    await createBet(formData.description, formData.amount, deadline)
  }

  const handleClose = () => {
    if (!isPending) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  // Get minimum datetime (1 hour from now)
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  // Get maximum datetime (30 days from now)
  const maxDateTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen w-screen">
      <div className="bg-card border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-[1px] border-gray-200 border-border">
          <h2 className="text-xl font-bold text-card-foreground">Create New Bet</h2>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
              <FileText size={16} />
              Bet Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this bet is about..."
              rows={3}
              className={cn(
                'w-full px-3 py-2 bg-input border border-input rounded-lg text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none',
                errors.description ? 'border-brand-red' : 'border-border'
              )}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-brand-red text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
              <DollarSign size={16} />
              Stake Amount (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              max="100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.1"
              className={cn(
                'w-full px-3 py-2 bg-input border border-input rounded-lg text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                errors.amount ? 'border-brand-red' : 'border-border'
              )}
              disabled={isPending}
            />
            {errors.amount && (
              <p className="text-brand-red text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">
              Both you and your opponent will stake this amount
            </p>
          </div>

          {/* Deadline */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
              <Calendar size={16} />
              Bet Deadline
            </label>
            <input
              type="datetime-local"
              min={minDateTime}
              max={maxDateTime}
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className={cn(
                'w-full px-3 py-2 bg-input border border-input rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                errors.deadline ? 'border-brand-red' : 'border-border'
              )}
              disabled={isPending}
            />
            {errors.deadline && (
              <p className="text-brand-red text-sm mt-1">{errors.deadline}</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">
              When should this bet be resolved?
            </p>
          </div>

          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                Please connect your wallet to create a bet
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-muted hover:bg-accent hover:text-accent-foreground disabled:bg-muted/50 text-card-foreground rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isConnected}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              {isPending ? 'Creating...' : 'Create Bet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}