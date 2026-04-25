import Image from 'next/image';
import Link from 'next/link';
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { MapPin, Mail, Phone } from 'lucide-react';
import { siteConfig, locations, whatsappLink, mapsLink } from '@/lib/site';
import { EdunorLogo } from './edunor-logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="container-luxe py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label={siteConfig.name}
              className="inline-block"
            >
             <EdunorLogo />
            </Link>
            <p className="mt-5 text-sm text-foreground/60 leading-relaxed text-pretty max-w-sm">
              Empresa familiar fundada en {siteConfig.foundedYear}, dedicada a
              la Náutica, Camping y Outdoor. Service oficial, repuestos
              originales y más de 60 años de experiencia.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 inline-flex items-center justify-center border border-border rounded-full text-foreground/70 hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-10 w-10 inline-flex items-center justify-center border border-border rounded-full text-foreground/70 hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-10 w-10 inline-flex items-center justify-center border border-border rounded-full text-foreground/70 hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="h-10 w-10 inline-flex items-center justify-center border border-border rounded-full text-foreground/70 hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.3em] text-primary mb-5">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/#nosotros"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/#sucursales"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Sucursales
                </Link>
              </li>
              <li>
                <Link
                  href="/#contacto"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {locations.map((loc) => (
            <div key={loc.id} className="lg:col-span-3">
              <h3 className="text-xs uppercase tracking-[0.3em] text-primary mb-5">
                {loc.name}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-start gap-3 text-foreground/70">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <a
                    href={mapsLink(loc.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {loc.address}
                    <br />
                    {loc.city}
                    <br />
                    {loc.region}
                  </a>
                </li>
                {loc.phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:${p.replace(/\s/g, '')}`}
                      className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{p}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a
          href={`mailto:${siteConfig.email}`}
          className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
        >
          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{siteConfig.email}</span>
        </a>
      </div>

      <div className="border-t border-border">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/50">
          <span>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </span>
          <span className="uppercase tracking-[0.2em]">
            Desde {siteConfig.foundedYear} · Náutica · Camping · Outdoor
          </span>
        </div>
      </div>
    </footer>
  );
}
