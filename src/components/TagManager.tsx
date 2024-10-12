import React, { useState } from 'react'
import { X } from 'lucide-react'

interface TagManagerProps {
  tags: string[]
  allTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

const TagManager: React.FC<TagManagerProps> = ({ tags, allTags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim())
      setNewTag('')
      setSuggestions([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewTag(value)
    if (value.trim()) {
      const filteredSuggestions = allTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (tag: string) => {
    onAddTag(tag)
    setNewTag('')
    setSuggestions([])
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded flex items-center">
            {tag}
            <button onClick={() => onRemoveTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <input
            type="text"
            value={newTag}
            onChange={handleInputChange}
            placeholder="Add new tag"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TagManager
