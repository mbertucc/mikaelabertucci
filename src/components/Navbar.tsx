const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="font-display text-xl tracking-wide text-foreground">
          MB
        </button>
        <div className="flex items-center gap-8">
          {["about", "work", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              className="text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {section}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
