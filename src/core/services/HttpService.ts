import EncryptionService from "./EncryptionService";
import HttpRequestValidationService from "./HttpRequestValidationService";
import PasswordService from "./PasswordService";
import WebTokenService from "./WebtokenService";

export default class HttpService {
    public readonly requestValidation: HttpRequestValidationService;
    public readonly passwordService: PasswordService;
    public readonly webtokenService: WebTokenService;
    public readonly encryptionService: EncryptionService;

    constructor(requestValidation: HttpRequestValidationService, passwordService: PasswordService, webtokenService: WebTokenService, encryptionService: EncryptionService) {
        this.requestValidation = requestValidation;
        this.passwordService = passwordService;
        this.webtokenService = webtokenService;
        this.encryptionService = encryptionService;
    }
}