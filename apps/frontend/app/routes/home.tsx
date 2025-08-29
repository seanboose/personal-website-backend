import type { Route } from './+types/home';
import { Welcome, type ImageDetails } from '../welcome/welcome';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sean Boose Party Bus' },
    { name: 'description', content: 'Welcome to my site!!' },
  ];
}

export default function Home() {
  const [images, setImages] = useState<ImageDetails[]>([]);

  useEffect(() => {
    const callback = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listImages`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const payload: { images: ImageDetails[] } = await res.json();
      setImages(payload.images || []);
    };
    callback();
  }, []);

  return <Welcome images={images} />;
}
