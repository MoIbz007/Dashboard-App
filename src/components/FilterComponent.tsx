import React from 'react';

interface FilterComponentProps {
  eventTypes: string[];
  selectedEventTypes: string[];
  onEventTypeChange: (eventType: string) => void;
  importanceLevels: string[];
  selectedImportance: string[];
  onImportanceChange: (importance: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  eventTypes,
  selectedEventTypes,
  onEventTypeChange,
  importanceLevels,
  selectedImportance,
  onImportanceChange,
}) => {
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Filters</h3>
      <div className="flex flex-wrap gap-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Event Types</h4>
          {eventTypes.map((type) => (
            <label key={type} className="flex items-center mr-4">
              <input
                type="checkbox"
                checked={selectedEventTypes.includes(type)}
                onChange={() => onEventTypeChange(type)}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Importance</h4>
          {importanceLevels.map((level) => (
            <label key={level} className="flex items-center mr-4">
              <input
                type="checkbox"
                checked={selectedImportance.includes(level)}
                onChange={() => onImportanceChange(level)}
                className="mr-2"
              />
              {level}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
