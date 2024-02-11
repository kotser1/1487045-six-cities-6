import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { DefaultOfferService, OfferEntity, OfferModel, OfferService } from './index.js';
import { types } from '@typegoose/typegoose';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}
