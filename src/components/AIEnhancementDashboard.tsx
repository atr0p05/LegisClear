
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Zap, Target, TrendingUp, Search, 
  FileText, AlertTriangle, CheckCircle, Clock,
  Lightbulb, BarChart3, Cpu, RefreshCw
} from 'lucide-react';
import { enhancedAIService, MLModel, PredictionRequest, DocumentClassification } from '@/services/EnhancedAIService';
import { toast } from 'sonner';

export const AIEnhancementDashboard: React.FC = () => {
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionRequest, setPredictionRequest] = useState<Partial<PredictionRequest>>({
    caseType: '',
    jurisdiction: '',
    facts: [],
    precedents: [],
    parties: { plaintiff: '', defendant: '' }
  });
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [documentText, setDocumentText] = useState('');
  const [documentClassification, setDocumentClassification] = useState<DocumentClassification | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    setModels(enhancedAIService.getAvailableModels());
  }, []);

  const handlePredictOutcome = async () => {
    if (!predictionRequest.caseType || !predictionRequest.jurisdiction) {
      toast.error('Please fill in case type and jurisdiction');
      return;
    }

    setIsLoading(true);
    try {
      const result = await enhancedAIService.predictCaseOutcome(predictionRequest as PredictionRequest);
      setPredictionResult(result);
      toast.success('Case outcome predicted successfully');
    } catch (error) {
      toast.error('Failed to predict case outcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassifyDocument = async () => {
    if (!documentText.trim()) {
      toast.error('Please enter document text');
      return;
    }

    setIsLoading(true);
    try {
      const result = await enhancedAIService.classifyDocument(documentText);
      setDocumentClassification(result);
      toast.success('Document classified successfully');
    } catch (error) {
      toast.error('Failed to classify document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const suggestions = await enhancedAIService.generateSearchSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
      toast.success('Search suggestions generated');
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a query for recommendations');
      return;
    }

    setIsLoading(true);
    try {
      const result = await enhancedAIService.getResearchRecommendations(searchQuery);
      setRecommendations(result);
      toast.success('Recommendations generated');
    } catch (error) {
      toast.error('Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrainModel = async (modelId: string) => {
    setIsLoading(true);
    try {
      const result = await enhancedAIService.retrainModel(modelId);
      if (result.success) {
        setModels(enhancedAIService.getAvailableModels());
        toast.success(`Model retrained successfully. New accuracy: ${(result.newAccuracy! * 100).toFixed(1)}%`);
      } else {
        toast.error('Failed to retrain model');
      }
    } catch (error) {
      toast.error('Failed to retrain model');
    } finally {
      setIsLoading(false);
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'favorable': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'unfavorable': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      training: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Enhancement & Machine Learning
          </h2>
          <p className="text-muted-foreground">Advanced AI capabilities for intelligent legal research</p>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="prediction">Case Prediction</TabsTrigger>
          <TabsTrigger value="classification">Document Analysis</TabsTrigger>
          <TabsTrigger value="suggestions">Smart Search</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>Type: {model.type}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm text-muted-foreground">
                        {(model.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={model.accuracy * 100} className="h-2" />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last trained: {model.lastTrained.toLocaleDateString()}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleRetrainModel(model.id)}
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retrain Model
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prediction">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Outcome Prediction</CardTitle>
                <CardDescription>Predict likely case outcomes using ML analysis</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="caseType">Case Type</Label>
                  <Input
                    id="caseType"
                    placeholder="e.g., Contract Dispute"
                    value={predictionRequest.caseType || ''}
                    onChange={(e) => setPredictionRequest(prev => ({ ...prev, caseType: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Input
                    id="jurisdiction"
                    placeholder="e.g., Federal District Court"
                    value={predictionRequest.jurisdiction || ''}
                    onChange={(e) => setPredictionRequest(prev => ({ ...prev, jurisdiction: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="plaintiff">Plaintiff</Label>
                  <Input
                    id="plaintiff"
                    placeholder="Plaintiff name"
                    value={predictionRequest.parties?.plaintiff || ''}
                    onChange={(e) => setPredictionRequest(prev => ({ 
                      ...prev, 
                      parties: { ...prev.parties!, plaintiff: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="defendant">Defendant</Label>
                  <Input
                    id="defendant"
                    placeholder="Defendant name"
                    value={predictionRequest.parties?.defendant || ''}
                    onChange={(e) => setPredictionRequest(prev => ({ 
                      ...prev, 
                      parties: { ...prev.parties!, defendant: e.target.value }
                    }))}
                  />
                </div>
                
                <Button 
                  onClick={handlePredictOutcome}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Target className="w-4 h-4 mr-2" />
                  {isLoading ? 'Analyzing...' : 'Predict Outcome'}
                </Button>
              </CardContent>
            </Card>

            {predictionResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getOutcomeIcon(predictionResult.outcome)}
                    Prediction Result
                  </CardTitle>
                  <CardDescription>
                    Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Reasoning</h4>
                    <ul className="space-y-1">
                      {predictionResult.reasoning.map((reason: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 mt-1 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Precedents</h4>
                    <div className="space-y-2">
                      {predictionResult.precedents.map((precedent: any, index: number) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          <div className="font-medium">{precedent.case}</div>
                          <div className="text-muted-foreground">
                            Similarity: {(precedent.similarity * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {predictionResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="classification">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Classification</CardTitle>
                <CardDescription>Analyze and classify legal documents using AI</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documentText">Document Text</Label>
                  <Textarea
                    id="documentText"
                    placeholder="Paste your document text here..."
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    rows={8}
                  />
                </div>
                
                <Button 
                  onClick={handleClassifyDocument}
                  disabled={isLoading}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isLoading ? 'Analyzing...' : 'Classify Document'}
                </Button>
              </CardContent>
            </Card>

            {documentClassification && (
              <Card>
                <CardHeader>
                  <CardTitle>Classification Results</CardTitle>
                  <CardDescription>
                    Confidence: {(documentClassification.confidence * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <Label>Document Type</Label>
                    <Badge variant="secondary" className="ml-2">
                      {documentClassification.type}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label>Key Topics</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {documentClassification.topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic.name} ({(topic.relevance * 100).toFixed(0)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Entities Found</Label>
                    <div className="space-y-2 mt-2">
                      {documentClassification.entities.map((entity, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="font-medium">{entity.text}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {entity.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {(entity.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Sentiment Analysis</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={documentClassification.sentiment.label === 'positive' ? 'default' : 
                                documentClassification.sentiment.label === 'negative' ? 'destructive' : 'secondary'}
                      >
                        {documentClassification.sentiment.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Score: {documentClassification.sentiment.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intelligent Search Enhancement</CardTitle>
                <CardDescription>Generate smart search suggestions and recommendations</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="searchQuery">Search Query</Label>
                  <Input
                    id="searchQuery"
                    placeholder="Enter your legal research query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleGenerateSuggestions}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Get Suggestions
                  </Button>
                  
                  <Button 
                    onClick={handleGetRecommendations}
                    disabled={isLoading}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {searchSuggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Suggestions</CardTitle>
                  <CardDescription>AI-generated query improvements</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {searchSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{suggestion.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {(suggestion.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        <div className="font-medium mb-1">{suggestion.query}</div>
                        <div className="text-sm text-muted-foreground">{suggestion.reasoning}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle>Research Recommendations</CardTitle>
                  <CardDescription>Personalized research suggestions</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Recommended Resources</h4>
                    <div className="space-y-2">
                      {recommendations.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">{rec.title}</div>
                            <Badge variant="outline">{rec.type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">{rec.reasoning}</div>
                          <div className="text-xs text-muted-foreground">
                            Relevance: {(rec.relevance * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.relatedTopics.map((topic: string, index: number) => (
                        <Badge key={index} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Suggested Next Steps</h4>
                    <ul className="space-y-1">
                      {recommendations.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Zap className="w-3 h-3 mt-1 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
