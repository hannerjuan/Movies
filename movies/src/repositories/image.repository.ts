import {DefaultCrudRepository} from '@loopback/repository';
import {Image, ImageRelations} from '../models';
import {MongoDataSource} from '../datasources/mongo.datasource';
import {inject} from '@loopback/core';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id,
  ImageRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Image, dataSource);
  }
}
