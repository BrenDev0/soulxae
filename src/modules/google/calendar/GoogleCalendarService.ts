import { NotFoundError } from "../../../core/errors/errors";
import { OAuth2Client } from 'google-auth-library';
import { google, calendar_v3 } from 'googleapis';
import { GoogleError } from "../google.erros";


export default class GoogleCalendarService {
    private readonly block = "google.services.calendar";

    async listCalendars(oauth2Client: OAuth2Client) {
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client});

        const res = await calendar.calendarList.list();
        
        const calendars = res.data.items
        
        if (!calendars || calendars.length === 0) {
            throw new NotFoundError("no calendars found in google drive")
        }

        return calendars.filter((calendar) => calendar.accessRole === 'owner');
    }

    async getCalendarDetails(oauth2Client: OAuth2Client, calendarReferenceId: string): Promise<calendar_v3.Schema$Calendar> {
        const block = `${this.block}.getCalendarDetails`
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const calendarDetails = await calendar.calendars.get({
                calendarId: calendarReferenceId
            })

            return calendarDetails.data
        } catch (error) {
            throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

     // events //
    async listEvents(oauth2Client: OAuth2Client, calendarReferenceId: string): Promise<calendar_v3.Schema$Event[]> {
        const block = `${this.block}.listEvents`
    
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
           
            const res = await calendar.events.list({
                calendarId: calendarReferenceId
            })
            
            const events = res.data.items
        
            return events || [];
        } catch (error) {
            throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    async findEvent(oauth2Client: OAuth2Client, calendarReferenceId: string, startTime: string, attendee: string): Promise<calendar_v3.Schema$Event | null> {
          const block = `${this.block}.findEvent`
        try {
            const datetime = new Date(startTime) 
            
            const events = await this.listEvents(oauth2Client, calendarReferenceId);

            const eventResource = events.find((event) => {
                if(!event.start?.dateTime || !event.attendees) {
                    return false
                }

                const eventTimeLocal = event.start.dateTime.substring(0, 19); 
                const searchTimeLocal = startTime.substring(0, 19);

                const timeMatches = eventTimeLocal === searchTimeLocal;
                const attendeeMatches = event.attendees.some(att => att.email === attendee);

                return timeMatches && attendeeMatches;
            }) 

            return eventResource || null
        } catch (error) {
             throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    async addEvent(oauth2Client: OAuth2Client, calendarReferenceId: string, event: Record<string, any>) {
        const block = `${this.block}.addEvent`
        try {
           const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const response = await calendar.events.insert({
                calendarId: calendarReferenceId,
                requestBody: event
            })

            return;
        } catch (error) {
            throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    async updateEvent(oauth2Client: OAuth2Client, calendarReferenceId: string, eventReferenceId: string, eventUpdates: Record<string, any>) {
        const block = `${this.block}.updateEvent`
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const response = calendar.events.patch({
                calendarId: calendarReferenceId,
                eventId: eventReferenceId,
                requestBody: eventUpdates
            })

            return;
        } catch (error) {
             throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    async deleteEvent(oauth2Client: OAuth2Client, calendarReferenceId: string, eventReferenceId: string): Promise<void> {
        const block = `${this.block}.deleteEvent`;
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            
            const response = calendar.events.delete({
                calendarId: calendarReferenceId,
                eventId: eventReferenceId
            })

            return;
        } catch (error) {
           throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    async checkAvailability(oauth2Client: OAuth2Client, calendarReferenceId: string, requestedDatetime: string): Promise<boolean> {
        const block = `${this.block}.checkAvailibility`;
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
                
            const startTime = new Date(requestedDatetime)
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
            
            const utcStartTime = new Date(startTime.getTime() + (6 * 60 * 60 * 1000))
            const utcEndTime = new Date(endTime.getTime() + (6 * 60 * 60 * 1000))
            
            const requestBody = {
                timeMin: utcStartTime.toISOString(),
                timeMax: utcEndTime.toISOString(),
                items: [{ id: calendarReferenceId }]
            }

            const response = await calendar.freebusy.query({ requestBody });
           
            const busySlots = response.data.calendars?.[calendarReferenceId]?.busy || [];

            return busySlots.length ===  0 
        } catch (error) {
            throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    async findAvailableTimeSlots(oauth2Client: OAuth2Client, calendarReferenceId: string, startDate: string, duration: number = 30, numberOfSlots: number = 3): Promise<string[]> {
        const block = `${this.block}.findAvailableTimeSlots`;
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            const availableSlots: string[] = [];
            

            const startTime = new Date(startDate);
        
            const endTime = new Date(startTime);
            endTime.setDate(endTime.getDate() + 7); // Check next 7 days
            
            // Convert to UTC for the query
            const utcStartTime = new Date(startTime.getTime() + (6 * 60 * 60 * 1000));
            const utcEndTime = new Date(endTime.getTime() + (6 * 60 * 60 * 1000));
            
            const requestBody = {
                timeMin: utcStartTime.toISOString(),
                timeMax: utcEndTime.toISOString(),
                items: [{ id: calendarReferenceId }]
            };

            const response = await calendar.freebusy.query({ requestBody });
            const busySlots = response.data.calendars?.[calendarReferenceId]?.busy || [];
            
          
            const allSlots = this.generateTimeSlots(startTime, endTime, duration);
            
         
            for (const slot of allSlots) {
                if (availableSlots.length >= numberOfSlots) break;
                
                const slotStart = new Date(slot);
                const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
                
                
                const isAvailable = !busySlots.some(busyPeriod => {
                    const busyStart = new Date(busyPeriod.start!);
                    const busyEnd = new Date(busyPeriod.end!);
                    
                   
                    return (slotStart < busyEnd && slotEnd > busyStart);
                });
                
                if (isAvailable) {
                    availableSlots.push(slot);
                }
            }
            
            return availableSlots;
            
        } catch (error) {
            console.log(error, "ERROR::::::::::")
            throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }

    private generateTimeSlots(startDate: Date, endDate: Date, durationMinutes: number = 30): string[] {
        const slots: string[] = [];
        const current = new Date(startDate);
        const now = new Date(); // Current time to filter out past slots
        
        const startHour = 9;
        const endHour = 17;
        
        while (current <= endDate) {
            // Skip weekends
            if (current.getDay() !== 0 && current.getDay() !== 6) {
                
                for (let hour = startHour; hour < endHour; hour++) {
                
                    for (let minute = 0; minute < 60; minute += durationMinutes) {
                        const slotTime = new Date(current);
                        slotTime.setHours(hour, minute, 0, 0);
                        
                        const slotEndTime = new Date(slotTime.getTime() + durationMinutes * 60 * 1000);
                        
                        // Check if slot is in the future and within business hours
                        const isInFuture = slotTime > now;
                        const isWithinBusinessHours = slotEndTime.getHours() < endHour || 
                            (slotEndTime.getHours() === endHour && slotEndTime.getMinutes() === 0);
                        
                        if (isInFuture && isWithinBusinessHours) {
                            slots.push(slotTime.toISOString());
                        }
                    }
                }
            }
            
            // Move to next day
            current.setDate(current.getDate() + 1);
        }
        
        return slots;
    }
}