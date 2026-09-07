"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    currency: "UYU",
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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadProperties();
  }, []);

    async function loadProperties() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("display_order", { ascending: true });
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

  async function removeImage(property, urlToRemove) {
    const updatedImages = (property.images || []).filter((url) => url !== urlToRemove);
    await supabase
      .from("properties")
      .update({ images: updatedImages })
      .eq("id", property.id);
    loadProperties();
  }

  
      async function reorderImages(property, fromIndex, toIndex) {
    const images = [...(property.images || [])];
    const [moved] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, moved);

    await supabase
      .from("properties")
      .update({ images })
      .eq("id", property.id);
    loadProperties();
  }

    async function reorderProperties(fromIndex, toIndex) {
    const reordered = [...properties];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setProperties(reordered);

    for (let i = 0; i < reordered.length; i++) {
      await supabase
        .from("properties")
        .update({ display_order: i })
        .eq("id", reordered[i].id);
    }
  }

    function handleDragOverAutoScroll(e) {
    const scrollThreshold = 100;
    const scrollSpeed = 15;

    if (e.clientY < scrollThreshold) {
      window.scrollBy(0, -scrollSpeed);
    } else if (window.innerHeight - e.clientY < scrollThreshold) {
      window.scrollBy(0, scrollSpeed);
    }
  }

  async function addImagesToProperty(property, files) {
    const uploadedUrls = [];
    for (const file of files) {
      const url = await uploadImage(file);
      uploadedUrls.push(url);
    }

    const updatedImages = [...(property.images || []), ...uploadedUrls];
    await supabase
      .from("properties")
      .update({ images: updatedImages })
      .eq("id", property.id);
    loadProperties();
  }

  function startEditing(property) {
    setEditingId(property.id);
    setEditForm({
      title: property.title,
      price: property.price,
      currency: property.currency || "UYU",
      address: property.address,
      exact_location: property.exact_location || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      listing_type: property.listing_type,
      description: property.description || "",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm({});
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function saveEdit(propertyId) {
    await supabase
      .from("properties")
      .update({
        title: editForm.title,
        price: Number(editForm.price),
        currency: editForm.currency,
        address: editForm.address,
        exact_location: editForm.exact_location,
        bedrooms: editForm.bedrooms ? Number(editForm.bedrooms) : null,
        bathrooms: editForm.bathrooms ? Number(editForm.bathrooms) : null,
        listing_type: editForm.listing_type,
        description: editForm.description,
      })
      .eq("id", propertyId);

    setEditingId(null);
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
          currency: form.currency,
          address: form.address,
          bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
          bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
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
          currency: "UYU",
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
        <div className="flex gap-2">
          <input
            name="price"
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded flex-1"
            required
          />
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="UYU">$ (UYU)</option>
            <option value="USD">U$D</option>
          </select>
        </div>
        <input
          name="bedrooms"
          type="number"
          placeholder="Dormitorios (dejar vacío si no aplica)"
          value={form.bedrooms}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="bathrooms"
          type="number"
          placeholder="Baños (dejar vacío si no aplica)"
          value={form.bathrooms}
          onChange={handleChange}
          className="border p-2 rounded"
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
            onChange={(e) => setExtraImageFiles((prev) => [...prev, ...Array.from(e.target.files)])}
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
                {properties.map((property, propIndex) => (
            <div
              key={property.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("propFromIndex", propIndex)}
                            onDragOver={(e) => {
                e.preventDefault();
                handleDragOverAutoScroll(e);
              }}
              onDrop={(e) => {
                const fromIndex = Number(e.dataTransfer.getData("propFromIndex"));
                reorderProperties(fromIndex, propIndex);
              }}
              className="border rounded-lg cursor-move"
            >
              <div className="p-3 flex items-center gap-3">
                <span className="text-gray-400 text-lg">⠿</span>
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
                  onClick={() => startEditing(property)}
                  className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProperty(property.id)}
                  className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
              
              {editingId === property.id && (
                <div className="px-3 pb-3 flex flex-col gap-2 bg-gray-50 pt-3">
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="border p-2 rounded text-sm"
                    placeholder="Título"
                  />
                  <input
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="border p-2 rounded text-sm"
                    placeholder="Dirección/Zona"
                  />
                  <input
                    name="exact_location"
                    value={editForm.exact_location}
                    onChange={handleEditChange}
                    className="border p-2 rounded text-sm"
                    placeholder="Dirección exacta"
                  />
                  <div className="flex gap-2">
                    <input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="border p-2 rounded text-sm flex-1"
                      placeholder="Precio"
                    />
                    <select
                      name="currency"
                      value={editForm.currency}
                      onChange={handleEditChange}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="UYU">$ (UYU)</option>
                      <option value="USD">U$D</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      name="bedrooms"
                      type="number"
                      value={editForm.bedrooms}
                      onChange={handleEditChange}
                      className="border p-2 rounded text-sm flex-1"
                      placeholder="Dormitorios"
                    />
                    <input
                      name="bathrooms"
                      type="number"
                      value={editForm.bathrooms}
                      onChange={handleEditChange}
                      className="border p-2 rounded text-sm flex-1"
                      placeholder="Baños"
                    />
                  </div>
                  <select
                    name="listing_type"
                    value={editForm.listing_type}
                    onChange={handleEditChange}
                    className="border p-2 rounded text-sm"
                  >
                    <option value="alquiler">Alquiler</option>
                    <option value="venta">Venta</option>
                  </select>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="border p-2 rounded text-sm"
                    placeholder="Descripción"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(property.id)}
                      className="bg-brand text-white text-sm px-4 py-1.5 rounded hover:bg-brand-dark"
                    >
                      Guardar cambios
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-sm border px-4 py-1.5 rounded hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {property.images && property.images.length > 0 && (
                <div className="flex flex-wrap gap-2 px-3 pb-3">
                  {property.images.map((url, index) => (
                    <div
                      key={url}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("fromIndex", index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const fromIndex = Number(e.dataTransfer.getData("fromIndex"));
                        reorderImages(property, fromIndex, index);
                      }}
                      className="relative cursor-move"
                    >
                      <img
                        src={url}
                        className="w-14 h-14 object-cover rounded border pointer-events-none"
                      />
                      <button
                        onClick={() => removeImage(property, url)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-3 pb-3">
                <label className="text-sm text-gray-600 block mb-1">Agregar más fotos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => addImagesToProperty(property, Array.from(e.target.files))}
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}