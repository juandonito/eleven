import Planet from './Planet';

interface Astronaut {
  id: number;
  firstname: string;
  lastname: string;
  originPlanet: Omit<Planet, 'id'>;
}

export default Astronaut;
