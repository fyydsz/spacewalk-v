import { toast } from "sonner"

// Custom toast styling presets
const toastStyles = {
  success: {
    classNames: {
      toast: '!bg-green-50 dark:!bg-green-950 !border-green-500 w-auto max-w-md min-w-[450px]',
      title: '!text-green-800 dark:!text-green-200 !font-semibold',
      description: '!text-green-700 dark:!text-green-300',
      icon: '!text-green-600 dark:!text-green-400',
    },
  },
  error: {
    classNames: {
      toast: '!bg-red-50 dark:!bg-red-950 !border-red-500 w-auto max-w-md min-w-[450px]',
      title: '!text-red-800 dark:!text-red-200 !font-semibold',
      description: '!text-red-700 dark:!text-red-300',
      icon: '!text-red-600 dark:!text-red-400',
    },
  },
  warning: {
    classNames: {
      toast: '!bg-yellow-50 dark:!bg-yellow-950 !border-yellow-500 w-auto max-w-md min-w-[450px]',
      title: '!text-yellow-800 dark:!text-yellow-200 !font-semibold',
      description: '!text-yellow-700 dark:!text-yellow-300',
      icon: '!text-yellow-600 dark:!text-yellow-400',
    },
  },
  info: {
    classNames: {
      toast: '!bg-blue-50 dark:!bg-blue-950 !border-blue-500 w-auto max-w-md min-w-[450px]',
      title: '!text-blue-800 dark:!text-blue-200 !font-semibold',
      description: '!text-blue-700 dark:!text-blue-300',
      icon: '!text-blue-600 dark:!text-blue-400',
    },
  },
}

// Custom toast functions with preset styling
export const customToast = {
  success: (title: string, description?: string, options?: any) => {
    return toast.success(title, {
      description,
      ...toastStyles.success,
      ...options,
    })
  },
  
  error: (title: string, description?: string, options?: any) => {
    return toast.error(title, {
      description,
      ...toastStyles.error,
      ...options,
    })
  },
  
  warning: (title: string, description?: string, options?: any) => {
    return toast.warning(title, {
      description,
      ...toastStyles.warning,
      ...options,
    })
  },
  
  info: (title: string, description?: string, options?: any) => {
    return toast.info(title, {
      description,
      ...toastStyles.info,
      ...options,
    })
  },
  
  // Default toast tanpa styling khusus
  default: (title: string, description?: string, options?: any) => {
    return toast(title, {
      description,
      ...options,
    })
  },
}
