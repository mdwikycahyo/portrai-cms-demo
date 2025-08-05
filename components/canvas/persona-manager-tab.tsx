"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Edit, Trash2, Users } from "lucide-react"
import type { Persona } from "@/types/persona"

interface PersonaManagerTabProps {
  personas: Persona[]
  onPersonasChange: (personas: Persona[]) => void
}

export function PersonaManagerTab({ personas, onPersonasChange }: PersonaManagerTabProps) {
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null)
  const [formData, setFormData] = useState<Partial<Persona>>({
    name: "",
    avatarUrl: "",
    type: "",
    responseStyle: "",
    tone: 5,
    sampleResponses: [""],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      avatarUrl: "",
      type: "",
      responseStyle: "",
      tone: 5,
      sampleResponses: [""],
    })
    setEditingPersona(null)
  }

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona)
    setFormData(persona)
  }

  const handleSave = () => {
    if (!formData.name?.trim()) return

    const newPersona: Persona = {
      id: editingPersona?.id || `persona-${Date.now()}`,
      name: formData.name.trim(),
      avatarUrl: formData.avatarUrl || "",
      type: formData.type || "Assistant",
      responseStyle: formData.responseStyle || "",
      tone: formData.tone || 5,
      sampleResponses: (formData.sampleResponses || []).filter((response) => response.trim()),
    }

    let updatedPersonas
    if (editingPersona) {
      updatedPersonas = personas.map((p) => (p.id === editingPersona.id ? newPersona : p))
    } else {
      updatedPersonas = [...personas, newPersona]
    }

    onPersonasChange(updatedPersonas)
    resetForm()
  }

  const handleDelete = (personaId: string) => {
    const updatedPersonas = personas.filter((p) => p.id !== personaId)
    onPersonasChange(updatedPersonas)
  }

  const addSampleResponse = () => {
    setFormData({
      ...formData,
      sampleResponses: [...(formData.sampleResponses || []), ""],
    })
  }

  const updateSampleResponse = (index: number, value: string) => {
    const updated = [...(formData.sampleResponses || [])]
    updated[index] = value
    setFormData({ ...formData, sampleResponses: updated })
  }

  const removeSampleResponse = (index: number) => {
    const updated = (formData.sampleResponses || []).filter((_, i) => i !== index)
    setFormData({ ...formData, sampleResponses: updated })
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-2">
      {" "}
      {/* Adjusted padding and height for tab content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Persona Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{editingPersona ? "Edit Persona" : "Create New Persona"}</h3>

          <div>
            <Label htmlFor="persona-name">Name</Label>
            <Input
              id="persona-name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Persona name"
            />
          </div>

          <div>
            <Label htmlFor="persona-avatar">Avatar URL</Label>
            <Input
              id="persona-avatar"
              value={formData.avatarUrl || ""}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <Label htmlFor="persona-type">Type</Label>
            <Select value={formData.type || ""} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select persona type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assistant">Assistant</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Colleague">Colleague</SelectItem>
                <SelectItem value="Interviewer">Interviewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="persona-style">Response Style</Label>
            <Textarea
              id="persona-style"
              value={formData.responseStyle || ""}
              onChange={(e) => setFormData({ ...formData, responseStyle: e.target.value })}
              placeholder="Describe how this persona responds (e.g., formal, friendly, direct)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="persona-tone">Tone (1-10)</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Formal</span>
              <Input
                id="persona-tone"
                type="range"
                min="1"
                max="10"
                value={formData.tone || 5}
                onChange={(e) => setFormData({ ...formData, tone: Number.parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-xs text-gray-500">Casual</span>
              <span className="text-sm font-medium w-8">{formData.tone}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Sample Responses</Label>
              <Button size="sm" variant="outline" onClick={addSampleResponse}>
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.sampleResponses || []).map((response, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={response}
                    onChange={(e) => updateSampleResponse(index, e.target.value)}
                    placeholder="Sample response..."
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeSampleResponse(index)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!formData.name?.trim()}>
              {editingPersona ? "Update" : "Create"} Persona
            </Button>
            {editingPersona && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Persona List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Existing Personas ({personas.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {personas.map((persona) => (
              <div key={persona.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{persona.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {persona.type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(persona)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(persona.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {persona.responseStyle && <p className="text-xs text-gray-600 mb-1">{persona.responseStyle}</p>}
                <div className="text-xs text-gray-500">
                  Tone: {persona.tone}/10 • {persona.sampleResponses.length} sample responses
                </div>
              </div>
            ))}
            {personas.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No personas created yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
