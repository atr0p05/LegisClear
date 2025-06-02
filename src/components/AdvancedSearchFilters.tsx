
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface SearchFilters {
  jurisdiction: string[];
  documentType: string[];
  dateRange: { from?: Date; to?: Date };
  confidenceThreshold: number;
  complexityLevel: string[];
  costRange: { min: number; max: number };
  includeAnalysis: boolean;
  includePrecedents: boolean;
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const jurisdictions = [
    'Federal', 'California', 'New York', 'Texas', 'Florida', 'Illinois'
  ];

  const documentTypes = [
    'Case Law', 'Statutes', 'Regulations', 'Contracts', 'Legal Opinions', 'Briefs'
  ];

  const complexityLevels = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ];

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Search Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jurisdiction Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Jurisdiction</label>
          <div className="grid grid-cols-2 gap-2">
            {jurisdictions.map((jurisdiction) => (
              <div key={jurisdiction} className="flex items-center space-x-2">
                <Checkbox
                  id={jurisdiction}
                  checked={filters.jurisdiction.includes(jurisdiction)}
                  onCheckedChange={() => toggleArrayFilter('jurisdiction', jurisdiction)}
                />
                <label htmlFor={jurisdiction} className="text-sm">
                  {jurisdiction}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Document Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Document Type</label>
          <div className="grid grid-cols-2 gap-2">
            {documentTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.documentType.includes(type)}
                  onCheckedChange={() => toggleArrayFilter('documentType', type)}
                />
                <label htmlFor={type} className="text-sm">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={{
                  from: filters.dateRange.from,
                  to: filters.dateRange.to
                }}
                onSelect={(range) => updateFilter('dateRange', range || {})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Confidence Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Minimum Confidence: {filters.confidenceThreshold}%
          </label>
          <Slider
            value={[filters.confidenceThreshold]}
            onValueChange={([value]) => updateFilter('confidenceThreshold', value)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Complexity Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Complexity Level</label>
          <div className="grid grid-cols-2 gap-2">
            {complexityLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={filters.complexityLevel.includes(level)}
                  onCheckedChange={() => toggleArrayFilter('complexityLevel', level)}
                />
                <label htmlFor={level} className="text-sm">
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeAnalysis"
              checked={filters.includeAnalysis}
              onCheckedChange={(checked) => updateFilter('includeAnalysis', checked)}
            />
            <label htmlFor="includeAnalysis" className="text-sm">
              Include detailed analysis
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includePrecedents"
              checked={filters.includePrecedents}
              onCheckedChange={(checked) => updateFilter('includePrecedents', checked)}
            />
            <label htmlFor="includePrecedents" className="text-sm">
              Include precedent citations
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={onResetFilters}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
