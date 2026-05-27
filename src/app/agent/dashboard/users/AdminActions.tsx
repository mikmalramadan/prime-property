'use client'

import { useActionState, useState } from 'react'

import { toast } from '@/components/ui/Toast'
import dynamic from 'next/dynamic'

const ToggleStatusModal = dynamic(
  () => import('@/components/admin/ToggleStatusModal').then((mod) => mod.ToggleStatusModal),
  { ssr: false }
)
const ResetPasswordModal = dynamic(
  () => import('@/components/admin/ResetPasswordModal').then((mod) => mod.ResetPasswordModal),
  { ssr: false }
)

export { ToggleStatusModal as ToggleAdminStatus, ResetPasswordModal }


