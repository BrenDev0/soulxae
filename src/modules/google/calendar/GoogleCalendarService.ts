import { NotFoundError } from "../../../core/errors/errors";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
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

     // events //
    async listEvents(oauth2Client: OAuth2Client, calendarReferenceId: string): Promise<unknown> {
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

    async deleteEvent(oauth2Client: OAuth2Client, calendarReferenceId: string, eventId: string) {
        const block = `${this.block}.deleteEvent`;
        try {
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const response = calendar.events.delete({
                calendarId: calendarReferenceId,
                eventId: eventId
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

            const calendarDetails = calendar.calendars.get({
                calendarId: calendarReferenceId
            })

            const calendarTimeZone = (await calendarDetails).data.timeZone;
            const startTime = new Date(requestedDatetime)
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        
            
            const requestBody = {
                timeMin: startTime.toISOString(),
                timeMax: endTime.toISOString(),
                timeZone: calendarTimeZone,
                items: [{ id: calendarReferenceId }]
            }

            const response = await calendar.freebusy.query({ requestBody });
            console.log(response.data, "RES::::::::::::")
            const busySlots = response.data.calendars?.[calendarReferenceId]?.busy || [];
            console.log(busySlots, "SLOTs::::::::::::::")

            return busySlots.length ===  0 
        } catch (error) {
            throw new GoogleError(undefined, {
                block: block,
                originalError: (error as Error).message
            });
        }
    }
}