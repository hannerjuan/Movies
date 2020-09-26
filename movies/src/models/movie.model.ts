import {Entity, model, property, hasMany} from '@loopback/repository';
import {Image} from './image.model';

@model()
export class Movie extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    default: 0,
  })
  rating?: number;

  @property({
    type: 'string',
    default: 'title',
  })
  title?: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: 'directors',
  })
  directors?: string[];

  @property({
    type: 'array',
    itemType: 'string',
    default: 'writers',
  })
  writers?: string[];

  @property({
    type: 'string',
    default: 'duration',
  })
  duration?: string;

  @hasMany(() => Image)
  images: Image[];

  constructor(data?: Partial<Movie>) {
    super(data);
  }
}

export interface MovieRelations {
  // describe navigational properties here
}

export type MovieWithRelations = Movie & MovieRelations;
