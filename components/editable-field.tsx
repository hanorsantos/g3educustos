"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface EditableFieldProps {
  value: string
  onChange: (value: string) => void
  prefix?: string
  placeholder?: string
  tooltip?: string
}

export function EditableField({ value, onChange, prefix, placeholder, tooltip }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
  }

  return (
    <div className="relative">
      {prefix && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{prefix}</div>}

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${prefix ? "pl-8" : ""} ${isEditing ? "border-blue-500 ring-1 ring-blue-500" : ""} ${tooltip ? "pr-8" : ""}`}
          placeholder={placeholder}
        />

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={(e) => e.preventDefault()}
                >
                  <InfoIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
