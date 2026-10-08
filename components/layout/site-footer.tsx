import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex gap-4">
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          {site.instagramUrl ? (
            <a href={site.instagramUrl}>Instagram</a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
