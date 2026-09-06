"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    image: "",
    images: "",
    exact_location: "",
    listing_type: "alquiler",
          description: "",
          pet_friendly: false,
    air_conditioning: false,
    heating: false,
    parking: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [extraImageFiles, setExtraImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    setProperties(data || []);
  }

  async function toggleTaken(id, currentValue) {
    await supabase
      .from("properties")
      .update({ is_taken: !currentValue })
      .eq("id", id);
    loadProperties();
  }

  async function deleteProperty(id) {
    const confirmDelete = confirm("¿Seguro que querés eliminar esta propiedad? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;

    await supabase.from("properties").delete().eq("id", id);
    loadProperties();
  }
  
  async function uploadImage(file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  
  function handleCheckbox(e) {
    setForm({ ...form, [e.target.name]: e.target.checked });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setMessage("");

    try {
      let mainImageUrl = "";
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile);
      }

      const extraImageUrls = [];
      for (const file of extraImageFiles) {
        const url = await uploadImage(file);
        extraImageUrls.push(url);
      }

      setUploading(false);

      const { error } = await supabase.from("properties").insert([
        {
          title: form.title,
          price: Number(form.price),
          address: form.address,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          image: mainImageUrl,
          images: extraImageUrls,
          exact_location: form.exact_location,
          listing_type: form.listing_type,
          description: form.description,
          pet_friendly: form.pet_friendly,
          air_conditioning: form.air_conditioning,
          heating: form.heating,
          parking: form.parking,
        },
      ]);

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("¡Propiedad cargada con éxito!");
        setForm({
          title: "",
          price: "",
          address: "",
          bedrooms: "",
          bathrooms: "",
          image: "",
          images: "",
          exact_location: "",
          listing_type: "alquiler",
    description: "",
    pet_friendly: false,
          air_conditioning: false,
          heating: false,
          parking: false,
        });
        setMainImageFile(null);
        setExtraImageFiles([]);
        router.refresh();
        loadProperties();
      }
    } catch (err) {
      setMessage("Error subiendo imágenes: " + err.message);
    }

    setLoading(false);
    setUploading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cargar nueva propiedad</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-black underline"
        >
          Cerrar sesión
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Título (ej: Casa en Pocitos)"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="address"
          placeholder="Dirección/Zona"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Precio (U$D)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="bedrooms"
          type="number"
          placeholder="Dormitorios"
          value={form.bedrooms}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="bathrooms"
          type="number"
          placeholder="Baños"
          value={form.bathrooms}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <div>
          <label className="block text-sm mb-1">Foto principal</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files[0])}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Fotos adicionales (podés elegir varias)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setExtraImageFiles(Array.from(e.target.files))}
            className="border p-2 rounded w-full"
          />
        </div>
        <input
          name="exact_location"
          placeholder="Dirección exacta (ej: Bulevar España 2589, Montevideo)"
          value={form.exact_location}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="listing_type"
          value={form.listing_type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="alquiler">Alquiler</option>
          <option value="venta">Venta</option>
        </select>

        <textarea
          name="description"
          placeholder="Descripción adicional (opcional): detalles, ubicación, estado, etc."
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          rows={8}
        />

        <div className="flex flex-col gap-2 border p-3 rounded">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="pet_friendly"
              checked={form.pet_friendly}
              onChange={handleCheckbox}
            />
            Admite mascotas
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="air_conditioning"
              checked={form.air_conditioning}
              onChange={handleCheckbox}
            />
            Aire acondicionado
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="heating"
              checked={form.heating}
              onChange={handleCheckbox}
            />
            Calefacción
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="parking"
              checked={form.parking}
              onChange={handleCheckbox}
            />
            Estacionamiento
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white p-2 rounded hover:bg-brand-dark disabled:opacity-50"
        >
          {uploading ? "Subiendo imágenes..." : loading ? "Cargando..." : "Cargar propiedad"}
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Propiedades cargadas</h2>
        <div className="flex flex-col gap-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg p-3 flex items-center gap-3"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">{property.title}</p>
                <p className="text-sm text-gray-500 mb-1">
                  {property.listing_type === "alquiler" ? "Alquiler" : "Venta"}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    property.is_taken
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {property.is_taken ? "No disponible" : "Disponible"}
                </span>
              </div>
              <button
                onClick={() => toggleTaken(property.id, property.is_taken)}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
              >
                {property.is_taken ? "Marcar disponible" : "Marcar como ocupada"}
              </button>
              <button
                onClick={() => deleteProperty(property.id)}
                className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}