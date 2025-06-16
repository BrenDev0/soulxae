export interface Agency {
    agency_Id?: number;
    user_id: number;
    name: string;
    branding: string;
    email: string | null;
    login_url: string | null;
    main_website: string;
    support_email: string | null;
    terms_of_service: string | null;
    privacy_policy_url: string | null;
    password: string | null;
    created_at?: string;
}

export interface AgencyData {
    agencyId?: number;
    userId: number;
    name: string;
    branding: string;
    email: string | null;
    loginUrl: string | null;
    mainWebsite: string;
    supportEmail: string | null;
    termsOfService: string |null;
    privacyPolicyUrl: string | null;
    password: string;
    createdAt?: string; 
}