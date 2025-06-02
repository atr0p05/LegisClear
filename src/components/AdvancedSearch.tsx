
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, Calendar as CalendarIcon, Filter, History, 
  Save, Bell, Star, User, MapPin, FileText, Clock,
  TrendingUp, BarChart3, Settings2
} from 'lucide-react';
import { searchService, SearchFilter, SearchResult } from '@/services/SearchService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AdvancedSearchProps {
  onSearchResults: (results: SearchResult[], totalCount: number) => void;
  onSemanticSearch: (results: SearchResult[]) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onSearchResults, 
  onSemanticSearch 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');

  const practiceAreas = [
    'Contract Law', 'Employment Law', 'Intellectual Property', 'Corporate Law',
    'Criminal Law', 'Family Law', 'Real Estate', 'Tax Law', 'Immigration Law',
    'Environmental Law', 'Securities Law', 'Bankruptcy Law'
  ];

  const jurisdictions = [
    'Federal', 'California', 'New York', 'Texas', 'Florida', 'Illinois',
    'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
  ];

  const documentTypes = [
    'Case Law', 'Statute', 'Regulation', 'Legal Brief', 'Contract',
    'Research Report', 'Contract Template', 'Court Filing', 'Regulation'
  ];

  const confidentialityLevels: ('public' | 'confidential' | 'restricted')[] = ['public', 'confidential', 'restricted'];

  useEffect(() => {
    loadSearchHistory();
    loadSavedSearches();
  }, []);

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const loadSavedSearches = () => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  };

  const saveToHistory = (searchQuery: string) => {
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = async (searchType: 'standard' | 'semantic' = 'standard') => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    saveToHistory(query);

    try {
      if (searchType === 'semantic') {
        const results = await searchService.performSemanticSearch(query);
        onSemanticSearch(results);
        toast.success(`Found ${results.length} semantically related documents`);
      } else {
        const { results, totalCount } = await searchService.performSearch({
          query,
          filters,
          maxResults: 50,
          sortBy: 'relevance'
        });
        onSearchResults(results, totalCount);
        toast.success(`Found ${totalCount} matching documents`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (filterType: keyof SearchFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleConfidentialityChange = (level: 'public' | 'confidential' | 'restricted', checked: boolean) => {
    const currentLevels = (filters.confidentiality || []) as ('public' | 'confidential' | 'restricted')[];
    if (checked) {
      handleFilterChange('confidentiality', [...currentLevels, level]);
    } else {
      handleFilterChange('confidentiality', currentLevels.filter(l => l !== level));
    }
  };

  const removeFilter = (filterType: keyof SearchFilter, value?: string) => {
    if (value && Array.isArray(filters[filterType])) {
      const currentArray = filters[filterType] as string[];
      handleFilterChange(filterType, currentArray.filter(item => item !== value));
    } else {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[filterType];
        return newFilters;
      });
    }
  };

  const saveSearch = () => {
    if (!searchName.trim()) {
      toast.error('Please enter a name for the saved search');
      return;
    }

    const newSavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      query,
      filters,
      createdAt: new Date(),
      alertsEnabled: false
    };

    const updated = [...savedSearches, newSavedSearch];
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    
    setShowSaveDialog(false);
    setSearchName('');
    toast.success('Search saved successfully');
  };

  const loadSavedSearch = (savedSearch: any) => {
    setQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    toast.success(`Loaded search: ${savedSearch.name}`);
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    toast.success('Search deleted');
  };

  const clearAllFilters = () => {
    setFilters({});
    toast.success('All filters cleared');
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return value ? count + 1 : count;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Main Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Legal Research
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your legal research query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="min-w-[100px]"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleSearch('semantic')}
              disabled={isSearching}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Semantic
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(true)}
              disabled={!query.trim()}
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                </CardTitle>
                {getActiveFilterCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Date Range
                </h4>
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange?.start ? format(filters.dateRange.start, 'PPP') : 'Start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange?.start}
                        onSelect={(date) => handleFilterChange('dateRange', { 
                          ...filters.dateRange, 
                          start: date 
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange?.end ? format(filters.dateRange.end, 'PPP') : 'End date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange?.end}
                        onSelect={(date) => handleFilterChange('dateRange', { 
                          ...filters.dateRange, 
                          end: date 
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator />

              {/* Practice Areas */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Practice Areas
                </h4>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {practiceAreas.map(area => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={filters.practiceAreas?.includes(area) || false}
                          onCheckedChange={(checked) => {
                            const current = filters.practiceAreas || [];
                            if (checked) {
                              handleFilterChange('practiceAreas', [...current, area]);
                            } else {
                              handleFilterChange('practiceAreas', current.filter(p => p !== area));
                            }
                          }}
                        />
                        <label htmlFor={area} className="text-sm cursor-pointer">
                          {area}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Jurisdictions */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Jurisdictions
                </h4>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {jurisdictions.map(jurisdiction => (
                      <div key={jurisdiction} className="flex items-center space-x-2">
                        <Checkbox
                          id={jurisdiction}
                          checked={filters.jurisdictions?.includes(jurisdiction) || false}
                          onCheckedChange={(checked) => {
                            const current = filters.jurisdictions || [];
                            if (checked) {
                              handleFilterChange('jurisdictions', [...current, jurisdiction]);
                            } else {
                              handleFilterChange('jurisdictions', current.filter(j => j !== jurisdiction));
                            }
                          }}
                        />
                        <label htmlFor={jurisdiction} className="text-sm cursor-pointer">
                          {jurisdiction}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Document Types */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Document Types
                </h4>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {documentTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.documentTypes?.includes(type) || false}
                          onCheckedChange={(checked) => {
                            const current = filters.documentTypes || [];
                            if (checked) {
                              handleFilterChange('documentTypes', [...current, type]);
                            } else {
                              handleFilterChange('documentTypes', current.filter(d => d !== type));
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Confidentiality Levels */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Access Level
                </h4>
                <div className="space-y-2">
                  {confidentialityLevels.map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`confidentiality-${level}`}
                        checked={((filters.confidentiality as ('public' | 'confidential' | 'restricted')[]) || []).includes(level)}
                        onCheckedChange={(checked) => {
                          handleConfidentialityChange(level, checked as boolean);
                        }}
                      />
                      <label htmlFor={`confidentiality-${level}`} className="text-sm cursor-pointer capitalize">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="filters" className="space-y-4">
            <TabsList>
              <TabsTrigger value="filters">Active Filters</TabsTrigger>
              <TabsTrigger value="history">Search History</TabsTrigger>
              <TabsTrigger value="saved">Saved Searches</TabsTrigger>
            </TabsList>

            <TabsContent value="filters">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Search Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {filters.practiceAreas?.map(area => (
                      <Badge key={area} variant="secondary" className="mr-1 mb-1">
                        {area}
                        <button 
                          onClick={() => removeFilter('practiceAreas', area)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {filters.jurisdictions?.map(jurisdiction => (
                      <Badge key={jurisdiction} variant="secondary" className="mr-1 mb-1">
                        {jurisdiction}
                        <button 
                          onClick={() => removeFilter('jurisdictions', jurisdiction)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {filters.documentTypes?.map(type => (
                      <Badge key={type} variant="secondary" className="mr-1 mb-1">
                        {type}
                        <button 
                          onClick={() => removeFilter('documentTypes', type)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {((filters.confidentiality as ('public' | 'confidential' | 'restricted')[]) || []).map(level => (
                      <Badge key={level} variant="secondary" className="mr-1 mb-1">
                        {level}
                        <button 
                          onClick={() => removeFilter('confidentiality', level)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {filters.dateRange && (
                      <Badge variant="secondary" className="mr-1 mb-1">
                        Date Range
                        <button 
                          onClick={() => removeFilter('dateRange')}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {getActiveFilterCount() === 0 && (
                      <p className="text-slate-500 text-sm">No active filters</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {searchHistory.length > 0 ? (
                    <div className="space-y-2">
                      {searchHistory.map((historyQuery, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <span className="text-sm">{historyQuery}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setQuery(historyQuery)}
                          >
                            Use
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No search history</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Saved Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedSearches.length > 0 ? (
                    <div className="space-y-3">
                      {savedSearches.map((savedSearch) => (
                        <div key={savedSearch.id} className="border rounded p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{savedSearch.name}</h4>
                              <p className="text-sm text-slate-600">{savedSearch.query}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">
                                  {Object.keys(savedSearch.filters).length} filters
                                </Badge>
                                {savedSearch.alertsEnabled && (
                                  <Badge variant="outline" className="text-green-600">
                                    <Bell className="w-3 h-3 mr-1" />
                                    Alerts On
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadSavedSearch(savedSearch)}
                              >
                                Load
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSavedSearch(savedSearch.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No saved searches</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Save Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveSearch}>
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
