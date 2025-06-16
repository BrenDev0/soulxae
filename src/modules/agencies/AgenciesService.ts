import { Agency, AgencyData } from './agencies.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class AgenciesService {
    private repository: BaseRepository<Agency>;
    private block = "agencies.service"
    constructor(repository: BaseRepository<Agency>) {
        this.repository = repository
    }

    async create(agency: AgencyData): Promise<Agency> {
        const mappedAgency = this.mapToDb(agency);
        try {
            return this.repository.create(mappedAgency);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedAgency)
            throw error;
        }
    }

    async resource(agencyId: string): Promise<Omit<AgencyData, "password"> | null> {
        try {
            const result = await this.repository.selectOne("agencyId", agencyId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {agencyId})
            throw error;
        }
    }

     async collection(userId: string): Promise<Omit<AgencyData, "password">[]> {
        try {
            const result = await this.repository.select("user_id", userId);
           
            return result.map((agency: Agency) => this.mapFromDb(agency))
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {userId})
            throw error;
        }
    }

    async update(agencyId: string, changes: AgencyData): Promise<Agency> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("agentcy_id", agencyId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(agencyId: string): Promise<Agency> {
        try {
            return await this.repository.delete("agency_id", agencyId) as Agency;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {agencyId})
            throw error;
        }
    }

    mapToDb(agency: AgencyData): Agency {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            user_id: agency.userId,
            name: agency.name,
            branding: agency.branding,
            email: agency.email,
            login_url: agency.loginUrl,
            main_website: agency.mainWebsite,
            support_email: agency.supportEmail,
            terms_of_service: agency.termsOfService,
            privacy_policy_url: agency.privacyPolicyUrl,
            password: agency.password,
        }
    }

    mapFromDb(agency: Agency): Omit<AgencyData, "password"> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agencyId: agency.agency_Id,
            userId: agency.user_id,
            name: agency.name,
            branding: agency.branding,
            email: agency.email,
            loginUrl: agency.login_url,
            mainWebsite: agency.main_website,
            supportEmail: agency.support_email,
            termsOfService: agency.terms_of_service,
            privacyPolicyUrl: agency.privacy_policy_url
        }
    }
}
