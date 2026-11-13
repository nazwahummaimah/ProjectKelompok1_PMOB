import { useCallback, useEffect, useState } from 'react';
import type { BikeData } from '../constants/bikes';
import { getBikes } from '../services/bikeService';

export const useFetchBikes = () => {
  const [bikes, setBikes] = useState<BikeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBikes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rows = await getBikes();
      setBikes(rows.map((bike) => ({
        id: bike.id,
        category: bike.category,
        name: bike.name,
        price: String(bike.price_per_hour),
        status: bike.status,
        location: bike.location ?? '',
        address: bike.address ?? undefined,
        hours: bike.opening_hours ?? undefined,
        features: bike.features ?? [],
        image: bike.image_url ?? '',
        tireSize: bike.tire_size ?? undefined,
        brakes: bike.brakes ?? undefined,
        transmission: bike.transmission ?? undefined,
        facilities: bike.facilities ?? undefined,
        techCondition: bike.technical_condition ?? undefined,
        extraTags: bike.extra_tags ?? undefined,
      })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data sepeda.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBikes();
  }, [fetchBikes]);

  return { bikes, loading, error, refetch: fetchBikes };
};
