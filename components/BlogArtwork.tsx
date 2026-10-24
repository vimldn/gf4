/** A typographic illustration, rather than a photograph of a particular meal. */
export default function BlogArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`journal-art${compact ? ' journal-art--compact' : ''}`} aria-hidden="true">
      <div className="journal-art__topline"><span>ARI’S FOOD NOTES</span><span>No. 001</span></div>
      <div className="journal-art__body">
        <div className="journal-art__number"><span>3</span><em>happy places.</em></div>
        <div className="journal-art__places">
          <div><span>01</span><p>PizzaExpress<small>Dough balls, pizza & a brownie</small></p></div>
          <div><span>02</span><p>Nando’s<small>It’s the wings for me.</small></p></div>
          <div><span>03</span><p>Wagamama<small>Noodles & chicken</small></p></div>
        </div>
      </div>
      <div className="journal-art__bottomline"><span>GLUTEN-FREE FAVOURITES</span><span>By Ari, age 10 <span className="journal-art__star">✳</span></span></div>
    </div>
  );
}
