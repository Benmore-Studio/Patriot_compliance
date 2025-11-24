"use client"

import { useState } from "react"
import { derIQClient, type DERIQMessage, type DERIQResponse } from "@/lib/ai/der-iq"

export function useDERIQ() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (message: string, context?: DERIQMessage["context"]): Promise<DERIQResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await derIQClient.sendMessage(message, context)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getContextualHelp = async (page: string): Promise<string[]> => {
    try {
      return await derIQClient.getContextualHelp(page)
    } catch (err) {
      console.error("[v0] Failed to get contextual help:", err)
      return []
    }
  }

  return {
    sendMessage,
    getContextualHelp,
    isLoading,
    error,
  }
}
