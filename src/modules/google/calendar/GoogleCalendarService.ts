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

            const calendarDetails = await this.getCalendarDetails(oauth2Client, calendarReferenceId)

            const calendarTimeZone = calendarDetails.timeZone;
            
            const startTime = new Date(requestedDatetime)
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
            
            const utcStartTime = new Date(startTime.getTime() + (6 * 60 * 60 * 1000))
            const utcEndTime = new Date(endTime.getTime() + (6 * 60 * 60 * 1000))
            
            const requestBody = {
                timeMin: utcStartTime.toISOString(),
                timeMax: utcEndTime.toISOString(),
                timeZone: calendarTimeZone,
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
}