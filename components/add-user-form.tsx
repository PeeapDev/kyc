"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface Region {
  id: string;
  name: string;
  count: number;
}

interface AddUserFormProps {
  onSubmit: (userData: any) => void;
  onCancel: () => void;
  formFields: FormField[];
  regions: Region[];
}

export function AddUserForm({ onSubmit, onCancel, formFields, regions }: AddUserFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const addressInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && addressInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setFormData(prev => ({ ...prev, address: place.formatted_address }));
        });
      }
    };

    initAutocomplete();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePhoto: e.target.files[0] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            required={field.required}
          />
        );
      case 'address':
        return (
          <Input
            id={field.id}
            name={field.id}
            ref={addressInputRef}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleSelectChange(field.id, value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'role':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleSelectChange(field.id, value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'region':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleSelectChange(field.id, value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : ""} />
              <AvatarFallback>Photo</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          {formFields.map((field) => {
            if (field.id === 'documentType' || field.id === 'documentNumber') {
              return null; // We'll handle these fields separately
            }
            return (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {renderField(field)}
              </div>
            );
          })}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="documentType">Document Type</Label>
              {renderField(formFields.find(field => field.id === 'documentType')!)}
            </div>
            <div className="w-1/2">
              <Label htmlFor="documentNumber">Document Number</Label>
              {renderField(formFields.find(field => field.id === 'documentNumber')!)}
            </div>
          </div>
          <div className="flex space-x-4">
            <Button type="submit">Add User</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
