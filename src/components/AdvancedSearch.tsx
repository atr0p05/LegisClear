
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Filter, Calendar, MapPin, FileText, User, 
  Tag, Clock, Star, Brain, History, Trash2, Bell
} from 'lucide-react';
import { searchService, SearchOptions, SearchFilter, SearchResult, SavedSearch } from '@/services/SearchService';
import { toast } from 'sonner';

interface AdvancedSearchProps {
  onSearchResults: (results: SearchResult[], totalCount: number) => void;
  onSemanticSearch?: (results: SearchResult[]) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onSearchResults, 
  onSemanticSearch 
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'author'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const practiceAreas = [
    'Contract Law', 'Employment Law', 'IP Law', 'Securities Law', 
    'Privacy Law', 'Tax Law', 'Real Estate Law', 'Criminal Law'
  ];

  const jurisdictions = [
    'Federal', 'California', 'New York', 'Texas', 'Florida', 
    'International', 'European Union', 'United Kingdom'
  ];

  const documentTypes = [
    'Case Analysis', 'Legal Memo', 'Policy Document', 'Compliance Guide',
    'Research Report', 'Contract Template', 'Court Filing', 'Regulation'
  ];

  const confidentialityLevels = ['public', 'confidential', 'restricted'] as const;

  useEffect(() => {
    loadSearchHistory();
    loadSavedSearches();
  }, []);

  const loadSearchHistory = () => {
    const history = searchService.getSearchHistory();
    setSearchHistory(history);
  };

  const loadSavedSearches = async () => {
    const searches = await searchService.getSavedSearches('current-user');
    setSavedSearches(searches);
  };

  const handleSearch = async (semanticMode: boolean = false) => {
    if (!query.trim() && Object.keys(filters).length === 0) {
      toast.error('Please enter a search query or apply filters');
      return;
    }

    setIsSearching(true);

    try {
      if (semanticMode) {
        const results = await searchService.performSemanticSearch(query);
        onSemanticSearch?.(results);
        toast.success(`Found ${results.length} semantically related documents`);
      } else {
        const searchOptions: SearchOptions = {
          query,
          filters,
          sortBy,
          sortOrder,
          maxResults: 50
        };

        const { results, totalCount, suggestions: newSuggestions } = await searchService.performSearch(searchOptions);
        onSearchResults(results, totalCount);
        setSuggestions(newSuggestions);
        
        toast.success(`Found ${totalCount} documents`);
      }

      loadSearchHistory();
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

  const removeFilter = (filterType: keyof SearchFilter, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value && Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = (newFilters[filterType] as string[]).filter(v => v !== value);
        if ((newFilters[filterType] as string[]).length === 0) {
          delete newFilters[filterType];
        }
      } else {
        delete newFilters[filterType];
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const saveCurrentSearch = async () => {
    if (!saveSearchName.trim()) {
      toast.error('Please enter a name for the saved search');
      return;
    }

    try {
      await searchService.saveSearch({
        name: saveSearchName,
        query,
        filters,
        userId: 'current-user',
        alertsEnabled: false
      });
      
      toast.success('Search saved successfully');
      setSaveSearchName('');
      setShowSaveDialog(false);
      loadSavedSearches();
    } catch (error) {
      toast.error('Failed to save search');
    }
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    toast.success(`Loaded saved search: ${savedSearch.name}`);
  };

  const deleteSavedSearch = async (searchId: string) => {
    try {
      await searchService.deleteSavedSearch(searchId);
      loadSavedSearches();
      toast.success('Saved search deleted');
    } catch (error) {
      toast.error('Failed to delete saved search');
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      if (filter) return count + 1;
      return count;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Enter your legal research query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={() => handleSearch()} disabled={isSearching}>
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSearch(true)} 
                disabled={isSearching}
                className="bg-purple-50 border-purple-200 hover:bg-purple-100"
              >
                <Brain className="w-4 h-4 mr-2" />
                Semantic
              </Button>
            </div>

            {/* Search Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="title">Sort by Title</SelectItem>
                    <SelectItem value="author">Sort by Author</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={!query.trim() && Object.keys(filters).length === 0}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  {getActiveFiltersCount()} filters
                </Badge>
                {getActiveFiltersCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          id={`practice-${area}`}
                          checked={filters.practiceAreas?.includes(area) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('practiceAreas', [...(filters.practiceAreas || []), area]);
                            } else {
                              removeFilter('practiceAreas', area);
                            }
                          }}
                        />
                        <label htmlFor={`practice-${area}`} className="text-sm cursor-pointer">
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
                          id={`jurisdiction-${jurisdiction}`}
                          checked={filters.jurisdictions?.includes(jurisdiction) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('jurisdictions', [...(filters.jurisdictions || []), jurisdiction]);
                            } else {
                              removeFilter('jurisdictions', jurisdiction);
                            }
                          }}
                        />
                        <label htmlFor={`jurisdiction-${jurisdiction}`} className="text-sm cursor-pointer">
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
                          id={`doctype-${type}`}
                          checked={filters.documentTypes?.includes(type) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('documentTypes', [...(filters.documentTypes || []), type]);
                            } else {
                              removeFilter('documentTypes', type);
                            }
                          }}
                        />
                        <label htmlFor={`doctype-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Saved Searches & History */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="suggestions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="saved">Saved Searches</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuery(suggestion.text)}
                          className="justify-start w-full"
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          {suggestion.text}
                          <Badge variant="outline" className="ml-auto">
                            {suggestion.category}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      Perform a search to see intelligent suggestions
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saved Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedSearches.length > 0 ? (
                    <div className="space-y-2">
                      {savedSearches.map(savedSearch => (
                        <div key={savedSearch.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                          <div className="flex-1">
                            <h4 className="font-medium">{savedSearch.name}</h4>
                            <p className="text-sm text-slate-600">{savedSearch.query}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" size="sm">
                                {Object.keys(savedSearch.filters).length} filters
                              </Badge>
                              {savedSearch.alertsEnabled && (
                                <Badge variant="outline" size="sm" className="text-green-600">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Alerts On
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      No saved searches yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Search History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {searchHistory.length > 0 ? (
                    <div className="space-y-2">
                      {searchHistory.map((historyItem, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuery(historyItem)}
                          className="justify-start w-full"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {historyItem}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      No search history yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Save Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter name for saved search..."
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveCurrentSearch}>
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
