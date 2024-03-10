import type { NextPage } from "next";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectToRegister = async () => {
      try {
        await router.push('/login');
      } catch (error) {
        console.error('Error redirecting:', error);
      }
    };

    void redirectToRegister();
  }, [router]);

  return null;
};

export default Home;




