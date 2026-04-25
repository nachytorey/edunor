import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProductGallery } from '@/components/product-gallery';
import { ProductCard } from '@/components/product-card';
import {
  getProductById,
  getRelatedProducts,
  products,
  categoryColor,
} from '@/lib/products';
import { siteConfig, whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description: product.shortDescription,
      images: [{ url: product.images[0], alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `/productos/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => `${siteConfig.url}${img}`),
    category: product.category,
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'ARS',
      price: '0',
      url: `${siteConfig.url}/productos/${product.id}`,
    },
  };

  const whatsappMsg = `Hola! Me interesa el producto ${product.name}. Me gustaría recibir más información.`;
  const emailSubject = encodeURIComponent(`Consulta: ${product.name}`);
  const emailBody = encodeURIComponent(
    `Hola,\n\nMe gustaría recibir más información sobre ${product.name}.\n\nGracias.`,
  );

  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground min-h-screen pt-28 pb-24">
        <div className="container-luxe">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link
                  href="/productos"
                  className="hover:text-primary transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="text-foreground/80 normal-case tracking-normal">
                {product.name}
              </li>
            </ol>
          </nav>

          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/60 hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <ProductGallery images={product.images} alt={product.name} />
            </div>

            <div className="lg:col-span-2">
              <span
                className={cn(
                  'inline-block text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border',
                  categoryColor(product.category),
                )}
              >
                {product.category}
              </span>
              <h1 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
                {product.name}
              </h1>
              <p className="mt-6 text-foreground/70 leading-relaxed text-pretty">
                {product.description}
              </p>

              <div className="mt-10 pt-8 border-t border-border">
                <div className="text-[11px] uppercase tracking-[0.25em] text-foreground/50 mb-2">
                  Precio
                </div>
                <div className="font-serif text-3xl text-primary">
                  {product.price === 'Consultar'
                    ? 'Consultar precio'
                    : product.price}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={whatsappLink(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground text-xs uppercase tracking-[0.25em] rounded-full hover:bg-primary/90 transition-colors"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Consultar por WhatsApp
                </a>
                <a
                  href={`mailto:${siteConfig.email}?subject=${emailSubject}&body=${emailBody}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-foreground/30 text-foreground text-xs uppercase tracking-[0.25em] rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Contactar
                </a>
              </div>

              {/* Specs */}
              <div className="mt-12">
                <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-5">
                  Ficha técnica
                </h2>
                <dl className="divide-y divide-border border-y border-border">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <dt className="text-foreground/60">{key}</dt>
                      <dd className="text-foreground font-medium text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-28 pt-20 border-t border-border">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <span className="text-xs uppercase tracking-[0.4em] text-primary">
                    — Relacionados
                  </span>
                  <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-balance">
                    Productos{' '}
                    <span className="text-primary italic">relacionados</span>
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      <Script
        id={`ld-product-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}
