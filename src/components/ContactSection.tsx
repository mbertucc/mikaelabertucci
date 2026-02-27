const ContactSection = () => {
  return (
    <section id="contact" className="py-32">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-4">Get in Touch</p>
        <h2 className="text-4xl md:text-6xl font-display italic text-foreground mb-6">
          Let's Create Together
        </h2>
        <p className="text-lg text-muted-foreground font-body max-w-lg mx-auto mb-10">
          Have a project in mind? I'd love to hear about it. Let's bring your vision to life.
        </p>
        <a
          href="mailto:hello@mikaelabertucci.com"
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Say Hello
        </a>
        <div className="flex items-center justify-center gap-8 mt-16 text-sm text-muted-foreground font-body">
          {["Instagram", "Behance", "LinkedIn"].map((social) => (
            <a key={social} href="#" className="tracking-widest uppercase hover:text-foreground transition-colors">
              {social}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
