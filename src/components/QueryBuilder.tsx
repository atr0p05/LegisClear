
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Search } from 'lucide-react';

interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: 'AND' | 'OR';
}

interface QueryBuilderProps {
  onQueryBuilt: (query: string, conditions: QueryCondition[]) => void;
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ onQueryBuilt }) => {
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fields = [
    { value: 'content', label: 'Document Content' },
    { value: 'title', label: 'Document Title' },
    { value: 'jurisdiction', label: 'Jurisdiction' },
    { value: 'date', label: 'Date' },
    { value: 'document_type', label: 'Document Type' },
    { value: 'case_name', label: 'Case Name' }
  ];

  const operators = [
    { value: 'contains', label: 'Contains' },
    { value: 'exact', label: 'Exact Match' },
    { value: 'near', label: 'Near (W/5)' },
    { value: 'before', label: 'Before Date' },
    { value: 'after', label: 'After Date' }
  ];

  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      field: 'content',
      operator: 'contains',
      value: '',
      connector: conditions.length > 0 ? 'AND' : undefined
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updates: Partial<QueryCondition>) => {
    setConditions(conditions.map(condition => 
      condition.id === id ? { ...condition, ...updates } : condition
    ));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };

  const buildQuery = () => {
    let query = '';
    conditions.forEach((condition, index) => {
      if (index > 0 && condition.connector) {
        query += ` ${condition.connector} `;
      }
      
      if (condition.operator === 'near') {
        query += `${condition.field}:(${condition.value} W/5)`;
      } else if (condition.operator === 'exact') {
        query += `${condition.field}:"${condition.value}"`;
      } else {
        query += `${condition.field}:${condition.value}`;
      }
    });
    
    onQueryBuilt(query, conditions);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Advanced Query Builder</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Simple Search' : 'Advanced Search'}
          </Button>
        </div>
      </CardHeader>
      
      {showAdvanced && (
        <CardContent className="space-y-4">
          {conditions.map((condition, index) => (
            <div key={condition.id} className="flex items-center gap-2 p-3 border rounded-lg">
              {index > 0 && (
                <Select
                  value={condition.connector}
                  onValueChange={(value: 'AND' | 'OR') => 
                    updateCondition(condition.id, { connector: value })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Select
                value={condition.field}
                onValueChange={(value) => updateCondition(condition.id, { field: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fields.map(field => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(condition.id, { operator: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map(operator => (
                    <SelectItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Enter value..."
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="flex-1"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCondition(condition.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={addCondition}>
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
            
            {conditions.length > 0 && (
              <Button onClick={buildQuery}>
                <Search className="w-4 h-4 mr-2" />
                Build Query
              </Button>
            )}
          </div>
          
          {conditions.length > 0 && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Query Preview:</h4>
              <div className="flex flex-wrap gap-1">
                {conditions.map((condition, index) => (
                  <React.Fragment key={condition.id}>
                    {index > 0 && condition.connector && (
                      <Badge variant="secondary" className="text-xs">
                        {condition.connector}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {condition.field}:{condition.value}
                    </Badge>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
