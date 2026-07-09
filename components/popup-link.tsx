"use client"

import { type ReactNode, useCallback } from "react"

interface PopupLinkProps {
  href: string
  children: ReactNode
  className?: string
  windowName?: string
  width?: number
  height?: number
}

export function PopupLink({
  href,
  children,
  className,
  windowName = "_blank",
  width = 1000,
  height = 700,
}: PopupLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2
      window.open(
        href,
        windowName,
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`
      )
    },
    [href, windowName, width, height]
  )

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
