import { cn } from '@/lib/utils'

/**
 * Skeleton — pulsing placeholder block.
 * Styled to match the Zeno OS dark enterprise palette.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-lg',
        className
      )}
      style={{ background: 'rgba(201,168,76,0.07)', ...((props as any).style ?? {}) }}
      {...props}
    />
  )
}

export { Skeleton }
