'use client';

import { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { setDoctorScheduleAction } from '@/src/features/settings/actions/settings-actions';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function DoctorScheduleForm({ initialSchedules = [] }: { initialSchedules: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Convert initial data to a workable state object
  const initialState = DAYS.map(day => {
    const existing = initialSchedules.find((s: any) => s.day === day);
    return {
      day,
      isActive: !!existing,
      timeSlots: existing?.timeSlots.map((ts: any) => ({ start: ts.start, end: ts.end })) || [],
    };
  });

  const [scheduleState, setScheduleState] = useState(initialState);

  const toggleDay = (dayIndex: number) => {
    const newState = [...scheduleState];
    newState[dayIndex].isActive = !newState[dayIndex].isActive;
    
    // Auto-add a default slot if turning on for the first time
    if (newState[dayIndex].isActive && newState[dayIndex].timeSlots.length === 0) {
      newState[dayIndex].timeSlots.push({ start: '09:00', end: '17:00' });
    }
    setScheduleState(newState);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newState = [...scheduleState];
    newState[dayIndex].timeSlots.push({ start: '09:00', end: '17:00' });
    setScheduleState(newState);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newState = [...scheduleState];
    newState[dayIndex].timeSlots.splice(slotIndex, 1);
    // If no slots left, auto-deactivate day
    if (newState[dayIndex].timeSlots.length === 0) {
      newState[dayIndex].isActive = false;
    }
    setScheduleState(newState);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const newState = [...scheduleState];
    newState[dayIndex].timeSlots[slotIndex][field] = value;
    setScheduleState(newState);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    // Format for backend
    const payload = {
      schedules: scheduleState
        .filter(s => s.isActive && s.timeSlots.length > 0)
        .map(s => ({
          day: s.day,
          timeSlots: s.timeSlots.map(ts => ({ start: ts.start, end: ts.end }))
        }))
    };

    try {
      const res = await setDoctorScheduleAction(payload);
      if (res.success) {
        setMessage({ text: 'Schedule successfully updated!', type: 'success' });
      } else {
        setMessage({ text: res.error || 'Failed to update schedule', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Weekly Availability
        </CardTitle>
        <CardDescription>
          Set your regular working hours. This will determine the time slots available for patients to book on your calendar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {scheduleState.map((dayObj, dayIndex) => (
            <div key={dayObj.day} className={`flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border ${dayObj.isActive ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}>
              
              <div className="flex items-center gap-3 min-w-[120px]">
                <Button 
                  type="button"
                  variant={dayObj.isActive ? "default" : "outline"}
                  className="w-full sm:w-16 h-10 font-bold tracking-widest"
                  onClick={() => toggleDay(dayIndex)}
                >
                  {dayObj.day}
                </Button>
                {dayObj.isActive ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 hidden sm:flex">Active</Badge>
                ) : (
                  <Badge variant="outline" className="hidden sm:flex text-muted-foreground">Off</Badge>
                )}
              </div>

              {dayObj.isActive && (
                <div className="flex-1 space-y-3 w-full">
                  {dayObj.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <Input 
                        type="time" 
                        value={slot.start} 
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                        className="w-[130px] font-mono"
                        required
                      />
                      <span className="text-muted-foreground font-bold">to</span>
                      <Input 
                        type="time" 
                        value={slot.end} 
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                        className="w-[130px] font-mono"
                        required
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addTimeSlot(dayIndex)}
                    className="text-xs font-bold border-dashed h-8 mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Slot
                  </Button>
                </div>
              )}
            </div>
          ))}

          {message.text && (
            <p className={`text-sm font-semibold p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-destructive' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </p>
          )}

          <div className="pt-4 border-t border-border flex justify-end">
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto px-8">
              {isLoading ? 'Saving Schedule...' : 'Save Availability'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
