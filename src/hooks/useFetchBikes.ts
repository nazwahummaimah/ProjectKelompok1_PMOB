import { useCallback, useEffect, useState } from 'react';
import { BikeData } from '../constants/bikes';
import { getPublicBikes } from '../services/bikeService';

export const useFetchBikes = () => {
  const [bikes, setBikes] = useState<BikeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchBikes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await getPublicBikes();
      setBikes(rows.map((bike) => ({
        id: bike.id,
        category: bike.category,
        name: bike.name,
        price: bike.price,
        status: bike.status,
        location: bike.location,
        address: bike.address,
        features: bike.features,
        image: bike.image,
        techCondition: bike.description,
      })));
    } catch (err: any) {
      setError(err?.message ?? 'Gagal mengambil data sepeda.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void fetchBikes(); }, [fetchBikes]);
  return { bikes, loading, error, refetch: fetchBikes };
};
