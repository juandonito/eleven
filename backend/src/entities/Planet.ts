import Image from './Image';

interface Planet {
  id: number;
  name: string;
  description: string;
  image: Omit<Image, 'id'>;
  isHabitable: boolean;
}

export default Planet;
