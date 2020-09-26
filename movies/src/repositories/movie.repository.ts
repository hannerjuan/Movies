import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Movie, MovieRelations, Image} from '../models';
import {MongoDataSource} from '../datasources/mongo.datasource';
import {inject, Getter} from '@loopback/core';
import {ImageRepository} from './image.repository';

export class MovieRepository extends DefaultCrudRepository<
  Movie,
  typeof Movie.prototype.id,
  MovieRelations
> {

  public readonly images: HasManyRepositoryFactory<Image, typeof Movie.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ImageRepository') protected imageRepositoryGetter: Getter<ImageRepository>,
  ) {
    super(Movie, dataSource);
    this.images = this.createHasManyRepositoryFactoryFor('images', imageRepositoryGetter,);
    this.registerInclusionResolver('images', this.images.inclusionResolver);
  }
}
