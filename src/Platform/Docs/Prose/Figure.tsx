type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className='my-8'>
      <img
        src={src}
        alt={alt}
        loading='lazy'
        className='block w-full rounded-panel border border-edge-soft'
      />
      {caption && (
        <figcaption className='mt-2.5 font-mono text-caption leading-snug text-secondary-soft'>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
