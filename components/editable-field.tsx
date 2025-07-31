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
      {prefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 font-medium">
          {prefix}
        </div>
      )}

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`h-12 text-base ${prefix ? "pl-12" : "pl-4"} ${
            isEditing ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
          } ${tooltip ? "pr-12" : "pr-4"} transition-all duration-200`}
          placeholder={placeholder}
        />

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <InfoIcon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
