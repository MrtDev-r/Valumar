import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Filters from "@/components/Filters";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const { address, minPrice, maxPrice, bedrooms, petFriendly, airConditioning, heating, parking } = params;
  let query = supabase.from("properties").select("*");

  if (address) query = query.ilike("address", `%${address}%`);
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));
  if (bedrooms) query = query.gte("bedrooms", Number(bedrooms));
  if (petFriendly) query = query.eq("pet_friendly", true);
  if (airConditioning) query = query.eq("air_conditioning", true);
  if (heating) query = query.eq("heating", true);
  if (parking) query = query.eq("parking", true);

  const { data: properties, error } = await query;

  if (error) {
    return <p className="p-8">Error cargando propiedades: {error.message}</p>;
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Valumar Inmobiliaria - Encontrá tu próximo hogar
      </h1>

      <Filters defaultValues={params} />

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron propiedades con esos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/propiedades/${property.id}`}>
              <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition relative">
                <img src={property.image} alt={property.title} className="w-full aspect-square object-contain bg-gray-100" />
                {property.is_taken && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow">
                    {property.listing_type === "alquiler" ? "¡Alquilado!" : "¡Vendido!"}
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{property.title}</h2>
                  <p className="text-gray-600">{property.address}</p>
                  <p className="text-lg font-bold mt-2 text-brand">
                    ${property.price.toLocaleString()}
                    {property.listing_type === "alquiler" && " /mes"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {property.bedrooms} dormitorios · {property.bathrooms} baños
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}