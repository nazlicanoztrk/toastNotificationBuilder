export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastNotification {
  id?: string
  type: NotificationType
  title: string
  message: string
  duration: number
  position: Position
  backgroundColor: string
  textColor: string
  showIcon: boolean
  showCloseButton: boolean
  animation: 'fade' | 'slide' | 'bounce'
}

export interface Preset {
  id: string
  name: string
  config: Omit<ToastNotification, 'id'>
  createdAt: string
}

export interface ActiveNotification extends ToastNotification {
  id: string
}