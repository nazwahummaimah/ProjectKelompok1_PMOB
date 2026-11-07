// hooks/useFetchBikes.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BikeData } from '../constants/bikes';

export const useFetchBikes = () => {
  const [bikes, setBikes] = useState<BikeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bikes')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setBikes(data as BikeData[]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  return { bikes, loading, error, refetch: fetchBikes };
};