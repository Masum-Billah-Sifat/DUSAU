"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/ui";
import {
  getPublicOrganization,
  type PublicOrganization,
} from "@/lib/public/api";
import { toMediaUrl } from "@/lib/public/media";

export default function Hero() {
  const [org, setOrg] = useState<PublicOrganization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadOrg() {
      try {
        const data = await getPublicOrganization();
        if (active) setOrg(data.organization);
      } catch {
        if (active) setOrg(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrg();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div className="container-app py-10 sm:py-14">
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--app-bg-soft))] shadow-xl sm:min-h-[640px] lg:min-h-[700px]">
            <div className="absolute inset-0 animate-pulse bg-[hsl(var(--app-bg-soft))]" />

            <div className="absolute inset-x-5 bottom-8 z-10 sm:inset-x-8 sm:bottom-12 lg:left-10 lg:right-auto lg:max-w-4xl">
              <div className="h-4 w-24 animate-pulse rounded-full bg-white/70" />
              <div className="mt-5 h-12 w-5/6 animate-pulse rounded-full bg-white/70" />
              <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/60" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="container-app py-10 sm:py-14">
        <FadeIn>
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--app-bg-soft))] shadow-xl sm:min-h-[640px] lg:min-h-[700px]">
            {org?.cover_image_path ? (
              <Image
                src={toMediaUrl(org.cover_image_path)}
                alt={org.cover_title || "DUSAU"}
                fill
                priority
                className="object-cover object-center brightness-[1.04] saturate-[1.05]"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--brand)/0.22),transparent_26rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.24),transparent_24rem),hsl(var(--app-bg-soft))]" />
            )}

            {/* image stays visible, only softened enough for text readability
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/22 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" /> */}

            <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/38 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />

            <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-8">
              <span className="inline-flex rounded-full border border-white/45 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-sm">
                DUSAU
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-8 z-10 sm:inset-x-8 sm:bottom-12 lg:left-10 lg:right-auto lg:max-w-4xl">
              <h1 className="font-display max-w-4xl text-4xl font-black leading-tight tracking-tight !text-white [text-shadow:0_4px_28px_rgba(0,0,0,0.95),0_1px_2px_rgba(0,0,0,1)] sm:text-5xl lg:text-7xl">
                {org?.cover_title ||
                  "Dhaka University Statistics Alumni Association"}
              </h1>
              {/* <h1 className="font-display max-w-4xl text-4xl font-black leading-tight tracking-tight text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-7xl">
                {org?.cover_title ||
                  "Dhaka University Statistics Alumni Association"}
              </h1> */}

              {/* <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-white/92 drop-shadow-[0_3px_16px_rgba(0,0,0,0.75)] sm:text-lg lg:text-xl">
                {org?.cover_description ||
                  "A connected community of statistics graduates, students, mentors, and professionals."}
              </p> */}

              <p className="mt-5 max-w-3xl text-base font-bold leading-8 !text-white [text-shadow:0_3px_20px_rgba(0,0,0,0.95),0_1px_2px_rgba(0,0,0,1)] sm:text-lg lg:text-xl">
                {org?.cover_description ||
                  "A connected community of statistics graduates, students, mentors, and professionals."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/events"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[hsl(var(--text-main))] shadow-lg transition hover:bg-[hsl(var(--brand-soft))] sm:w-fit"
                >
                  Explore Events
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/55 bg-white/15 px-5 py-3 text-sm font-black text-white shadow-lg backdrop-blur-sm transition hover:bg-white/25 sm:w-fit"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
