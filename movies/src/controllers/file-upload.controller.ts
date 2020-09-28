import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
  param,
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {UploadFilesKeys} from '../keys/upload-files-keys';
import {Movie} from '../models';
import {
  MovieRepository,
} from '../repositories';

export class FileUploadController {
  /**
   *
   * @param MovieRepostory
   */
  constructor(
    @repository(MovieRepository)
    private movieRepository: MovieRepository
  ) {}

   //POST TO MOVIE IMAGE ASSOCIATED TO MOVIEID

  /**
   * Add or replace the profile photo of a customer by customerId
   * @param request
   * @param movieId
   * @param response
   */
  @post('/movieImage', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Movie Image Path associated to movieId',
      },
    },
  })
  async movieUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('movieId') movieId: string,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const moviePath = path.join(
      __dirname,
      UploadFilesKeys.MOVIE_IMAGE_PATH,
    );
    let res = await this.StoreFileToPath(
      moviePath,
      UploadFilesKeys.MOVIE_IMAGE_FIELDNAME,
      request,
      response,
      UploadFilesKeys.IMAGE_ACCEPTED_EXT,
    );
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let mov: Movie = await this.movieRepository.findById(
          movieId,
        );
        if (mov) {
          mov.path = filename;
          this.movieRepository.replaceById(movieId, mov);
          return {filename: filename};
        }
      }
    }
    return res;
  }

  //POST PARA MOVIE IMAGE

  /**
   *
   * @param response
   * @param movieId
   * @param request
   */
  @post('/movieImage', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Movie Image',
      },
    },
  })
  async movieImageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const movieImagePath = path.join(
      __dirname,
      UploadFilesKeys.MOVIE_IMAGE_PATH,
    );
    let res = await this.StoreFileToPath(
      movieImagePath,
      UploadFilesKeys.MOVIE_IMAGE_FIELDNAME,
      request,
      response,
      UploadFilesKeys.IMAGE_ACCEPTED_EXT,
    );
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }

  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  private StoreFileToPath(
    storePath: string,
    fieldname: string,
    request: Request,
    response: Response,
    acceptedExt: string[],
  ) {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname).toUpperCase();
          console.log('Extensión del archivo: ' + ext);
          console.log(acceptedExt);
          console.log(acceptedExt.includes(ext));
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(
            new HttpErrors[400]('This format file is not supported.'),
          );
        },
        limits: {
          fileSize: UploadFilesKeys.MAX_FILE_SIZE,
        },
      }).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  /**
   * Return a config for multer storage
   * @param path
   */
  // Donde lo voy a guardar y como lo voy a guardar y con que nombre y en que ruta
  private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: function (req, file, cb) {
        filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });
    return storage;
  }
}