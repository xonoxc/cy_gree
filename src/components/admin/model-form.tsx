"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Field {
    name: string
    type: "string" | "number" | "boolean" | "enum"
    label: string
    options?: string[]
}

interface ModelFormProps {
    fields: Field[]
    submitHandler: (data: Record<string, string | number | boolean>) => void
    initialData?: Record<string, string | number | boolean>
}

export function ModelForm({
    fields,
    submitHandler,
    initialData,
}: ModelFormProps) {
    const [formData, setFormData] = useState<
        Record<string, string | number | boolean>
    >(initialData || {})

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        submitHandler(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
                <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "string" && (
                        <Input
                            id={field.name}
                            value={(formData[field.name] as string) || ""}
                            onChange={e =>
                                handleChange(field.name, e.target.value)
                            }
                        />
                    )}
                    {field.type === "number" && (
                        <Input
                            id={field.name}
                            type="number"
                            value={(formData[field.name] as number) || ""}
                            onChange={e =>
                                handleChange(
                                    field.name,
                                    Number.parseFloat(e.target.value)
                                )
                            }
                        />
                    )}
                    {field.type === "boolean" && (
                        <Checkbox
                            id={field.name}
                            checked={(formData[field.name] as boolean) || false}
                            onCheckedChange={checked =>
                                handleChange(field.name, checked)
                            }
                        />
                    )}
                    {field.type === "enum" && field.options && (
                        <Select
                            value={(formData[field.name] as string) || ""}
                            onValueChange={value =>
                                handleChange(field.name, value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={`Select ${field.label}`}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            ))}
            <Button type="submit">Submit</Button>
        </form>
    )
}
