import { NextFunction, Request, Response } from 'express';
import { InternalServerError, NotFoundError } from '../errorHandling/errors';
import AstronautsUseCases from '../usecases/AstronautsUseCases';

const AstronautController = {
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);

    try {
      const result = await AstronautsUseCases.getAstronautsList({
        page,
        limit,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const astronaut = await AstronautsUseCases.getAstronautById(Number(id));
      res.status(200).json(astronaut);
    } catch (error) {
      next(error);
    }
  },

  create: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { firstname, lastname, originPlanetId } = req.body;
    try {
      const astronaut = await AstronautsUseCases.createAstronaut({
        firstname,
        lastname,
        originPlanetId,
      });
      res.status(200).json(astronaut);
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    const { firstname, lastname, originPlanetId } = req.body;
    try {
      const updated = await AstronautsUseCases.updateAstronaut({
        id: Number(id),
        firstname,
        lastname,
        originPlanetId,
      });
      if (!updated) {
        next(new InternalServerError());
      }
      res.status(200).json({ message: 'Astronaut updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const deleted = await AstronautsUseCases.deleteAstronaut(Number(id));
      if (!deleted) {
        next(new NotFoundError('Astronaut not found'));
      }
      res.status(200).json({ message: 'Astronaut deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};

export default AstronautController;
