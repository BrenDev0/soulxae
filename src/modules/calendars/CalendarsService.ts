import { Calendar, CalendarData } from './calendars.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class CalendarsService {
    private repository: BaseRepository<Calendar>;
    private block = "calendars.service"
    constructor(repository: BaseRepository<Calendar>) {
        this.repository = repository
    }

    async create(calendars: Omit<CalendarData, "calendarId">): Promise<Calendar> {
        const mappedCalendar = this.mapToDb(calendars);
        try {
            return this.repository.create(mappedCalendar as Calendar);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedCalendar)
            throw error;
        }
    }

    async resource(calendarId: string): Promise<Omit<CalendarData, "refreshToken"> | null> {
        try {
            const result = await this.repository.selectOne("calendar_id", calendarId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {calendarId})
            throw error;
        }
    }

    async collection(userId: string): Promise<Omit<CalendarData, "refreshToken">[]> {
        try {
            const result = await this.repository.select("user_id", userId);
            
            return result.map((calendar) => this.mapFromDb(calendar))
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", {userId})
            throw error;
        }
    }

    async update(calendarId: string, changes: CalendarData): Promise<Calendar> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("calendar_id", calendarId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(calendarId: string): Promise<Calendar> {
        try {
            return await this.repository.delete("calendar_id", calendarId) as Calendar;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {calendarId})
            throw error;
        }
    }

    mapToDb(calendar: Omit<CalendarData, "calendarId">): Omit<Calendar, "calendar_id"> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
           user_id: calendar.userId,
           calendar_reference_id: encryptionService.encryptData(calendar.calendarReferenceId),
           refresh_token: calendar.refreshToken
        }
    }

    mapFromDb(calendar: Calendar): Omit<CalendarData, "refreshToken"> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            calendarId: calendar.calendar_id,
            userId: calendar.user_id,
            calendarReferenceId: encryptionService.decryptData(calendar.calendar_reference_id),
        }
    }
}
