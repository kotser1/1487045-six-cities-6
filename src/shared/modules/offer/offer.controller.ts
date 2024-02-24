import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { OfferPreviewRdo, OfferRdo, OfferService } from './index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    // TODO:
    // this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getOffer });
    // this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    // this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers });
    // this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    //TODO: добавить маршрут для добавления/удаления оффера в/из favorites (path: '/favorites?offerId=123' или '/:offerId/favorites' ?)
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    const responseData = fillDTO(OfferPreviewRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    const responseData = fillDTO(OfferRdo, result);
    this.created(res, responseData);
  }

  public async update({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(String(params.offerId), body);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }
}