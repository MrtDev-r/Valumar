import { supabase } from "@/lib/supabase";
import Gallery from "@/components/Gallery";

export default async function PropertyDetail({ params }) {
  const { id } = await params;

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    return <p className="p-8">Propiedad no encontrada</p>;
  }

  const mapQuery = encodeURIComponent(property.exact_location || property.address);

  const amenities = [
    { label: "Admite mascotas", active: property.pet_friendly },
    { label: "Aire acondicionado", active: property.air_conditioning },
    { label: "Calefacción", active: property.heating },
    { label: "Estacionamiento", active: property.parking },
  ];

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="relative">
        <Gallery mainImage={property.image} images={property.images} />
        {property.is_taken && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-base font-bold px-4 py-2 rounded shadow z-10">
            {property.listing_type === "alquiler" ? "¡Alquilado!" : "¡Vendido!"}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mt-6">{property.title}</h1>
      <p className="text-gray-600">{property.address}</p>

      <p className="text-2xl font-bold mt-4 text-brand">
        ${property.price.toLocaleString()}
        {property.listing_type === "alquiler" && " /mes"}
      </p>

      <p className="mt-2 text-gray-700">
        {property.bedrooms} dormitorios · {property.bathrooms} baños
      </p>

      {property.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
        <div className="grid grid-cols-2 gap-2">
          {amenities.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 p-2 rounded ${
                item.active ? "text-black" : "text-gray-400"
              }`}
            >
              <span>{item.active ? "✅" : "❌"}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
        <iframe
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          className="w-full h-72 rounded-lg border-0"
          loading="lazy"
        />
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-3">¿Te interesa esta propiedad?</h2>
        <a href={`https://wa.me/59826985487?text=${encodeURIComponent(`Hola! Me interesa la propiedad "${property.title}" (${property.address}). ¿Podemos coordinar una visita?`)}`} target="_blank" className="inline-flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-lg font-semibold hover:bg-brand-dark transition">
          📱 Consultar por WhatsApp
        </a>
      </div>
    </main>
  );
}