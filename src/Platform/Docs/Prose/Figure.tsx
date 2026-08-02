type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className='my-6'>
      <img
        src={src}
        alt={alt}
        loading='lazy'
        className='block w-full rounded-card border border-edge-soft'
      />
      {caption && (
        <figcaption className='mt-2.5 font-mono text-caption leading-snug text-tertiary-soft'>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
