import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  duration_seconds?: number;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  exercises?: Exercise[];
}

const UV_WorkoutTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();
  const token = useAppStore(state => state.authentication_state.auth_token);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load workout templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateDetails = async (id: number) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/templates/${id}`);
      setSelectedTemplate(response.data);
    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };

  const saveTemplate = async (templateId: number) => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to save templates.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/user/templates`,
        { template_id: templateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Success",
        description: "Workout template saved to your library!",
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Workout Templates</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <Badge variant={template.difficulty === 'Beginner' ? 'secondary' : template.difficulty === 'Advanced' ? 'destructive' : 'default'}>
                  {template.difficulty}
                </Badge>
              </div>
              <CardDescription>{template.category} • {template.duration_minutes} min</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-500 line-clamp-3">{template.description}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1" onClick={() => fetchTemplateDetails(template.id)}>
                    Preview
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{selectedTemplate?.name || 'Loading...'}</SheetTitle>
                    <SheetDescription>
                      {selectedTemplate?.description}
                    </SheetDescription>
                  </SheetHeader>
                  
                  {selectedTemplate && (
                    <div className="mt-6 space-y-6">
                      <div className="flex gap-2 flex-wrap">
                        <Badge>{selectedTemplate.category}</Badge>
                        <Badge variant="outline">{selectedTemplate.difficulty}</Badge>
                        <Badge variant="outline">{selectedTemplate.duration_minutes} min</Badge>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Exercises</h3>
                        <div className="space-y-4">
                          {selectedTemplate.exercises?.map((exercise, index) => (
                            <div key={exercise.id} className="border rounded-md p-3 bg-slate-50">
                              <div className="flex justify-between font-medium">
                                <span>{index + 1}. {exercise.exercise_name}</span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1 grid grid-cols-3 gap-2">
                                <div>Sets: {exercise.sets}</div>
                                <div>Reps: {exercise.reps}</div>
                                <div>Rest: {exercise.rest_seconds}s</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full mt-4" onClick={() => {
                        saveTemplate(selectedTemplate.id);
                      }}>
                        Save to My Library
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              
              <Button className="flex-1" onClick={() => saveTemplate(template.id)}>
                Save
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UV_WorkoutTemplates;
