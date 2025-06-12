import express, { Request, Response } from 'express';
import Container from '../../core/dependencies/Container';
import PlatformsService from '../platforms/PlatformsService';
import HttpService from '../../core/services/HttpService';
import { AuthorizationError, BadRequestError } from '../../core/errors/errors';

export default class WhatsappController {
    private httpService: HttpService;

    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }
    
}