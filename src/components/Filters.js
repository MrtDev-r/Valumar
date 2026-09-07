"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Filters({ defaultValues }) {
  const router = useRouter();
  const [address, setAddress] = useState(defaultValues.address || "");
  const [minPrice, setMinPrice] = useState(defaultValues.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(defaultValues.maxPrice || "");
  const [bedrooms, setBedrooms] = useState(defaultValues.bedrooms || "");
  const [petFriendly, setPetFriendly] = useState(defaultValues.petFriendly === "true");
  const [airConditioning, setAirConditioning] = useState(defaultValues.airConditioning === "true");
  const [heating, setHeating] = useState(defaultValues.heating === "true");
  const [parking, setParking] = useState(defaultValues.parking === "true");

  function handleSubmit(e) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (address) params.set("address", address);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (petFriendly) params.set("petFriendly", "true");
    if (airConditioning) params.set("airConditioning", "true");
    if (heating) params.set("heating", "true");
    if (parking) params.set("parking", "true");

    router.push(`/?${params.toString()}`);
  }

  function handleClear() {
    setAddress("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setPetFriendly(false);
    setAirConditioning(false);
    setHeating(false);
    setParking(false);
    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100"
    >
      <input
        placeholder="Zona (ej: Pocitos)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 rounded flex-1 min-w-[150px]"
      />
      <input
        type="number"
        placeholder="Precio mín."
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="border p-2 rounded w-32"
      />
      <input
        type="number"
        placeholder="Precio máx."
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border p-2 rounded w-32"
      />
      <select
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Dormitorios</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <div className="flex flex-wrap gap-3 items-center w-full">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={petFriendly}
            onChange={(e) => setPetFriendly(e.target.checked)}
          />
          Admite mascotas
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={airConditioning}
            onChange={(e) => setAirConditioning(e.target.checked)}
          />
          Aire acondicionado
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={heating}
            onChange={(e) => setHeating(e.target.checked)}
          />
          Calefacción
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={parking}
            onChange={(e) => setParking(e.target.checked)}
          />
          Estacionamiento
        </label>
      </div>

      <button
        type="submit"
        className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-100 transition"
      >
        Limpiar
      </button>
    </form>
  );
}