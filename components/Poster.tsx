export function Poster({
  title,
  year,
  posterPath,
  className = "",
}: {
  title: string;
  year: number;
  posterPath?: string | null;
  className?: string;
}) {
  if (posterPath) {
    const src = posterPath.startsWith("http")
      ? posterPath
      : `https://image.tmdb.org/t/p/w500${posterPath}`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${title} (${year})`}
        className={`aspect-[2/3] w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`flex aspect-[2/3] w-full flex-col justify-between bg-bg3 p-4 ${className}`}>
      <p className="text-lg font-semibold leading-tight">{title}</p>
      <p className="text-sm text-muted">{year}</p>
    </div>
  );
}
