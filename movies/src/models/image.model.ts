import {Entity, model, property} from '@loopback/repository';

@model()
export class Image extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  path?: string;

  @property({
    type: 'number',
    default: 0,
  })
  order?: number;

  @property({
    type: 'string',
  })
  movieId?: string;

  constructor(data?: Partial<Image>) {
    super(data);
  }
}

export interface ImageRelations {
  // describe navigational properties here
}

export type ImageWithRelations = Image & ImageRelations;
