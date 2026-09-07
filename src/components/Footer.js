export default function Footer() {
  return (
    <footer className="bg-brand text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold">VALUMAR Inmobiliaria</h3>
          <p className="text-sm text-white/80 mt-1">
            Encontrá tu próxima casa con nosotros.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <div className="flex flex-col gap-1 text-sm">
            <a href="https://wa.me/59826985487" target="_blank" className="hover:underline">
              WhatsApp
            </a>
            <a href="tel:+59826985487" className="hover:underline">
              Teléfono
            </a>
            <a href="https://facebook.com/profile.php?id=61577878327084&locale=es_LA" target="_blank" className="hover:underline">
              Facebook
            </a>
            <a href="https://www.instagram.com/valumar.inmo?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExUGRXTXAydWlZVThMMDRTUHNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR7nRHDrRatIcXTZ3uPeSCrl-dZxCUjaxhRsz89TTXHRzjlRuNNnFo4xzITXJg_aem_PkQvRcm62huI3zmmD9wJYw" target="_blank" className="hover:underline">
              Instagram
            </a>
            <a href="mailto:inmovalumar@gmail.com" className="hover:underline">
              inmovalumar@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-white/70 py-3 border-t border-white/20">
        © {new Date().getFullYear()} Valumar Inmobiliaria. Todos los derechos reservados.
      </div>
    </footer>
  );
}