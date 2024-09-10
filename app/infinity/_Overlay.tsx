const _ = () => {
  return (
    <div className="fixed z-10 text-white inset-0 blur-[0.5px] flex items-center justify-end p-6 gap-2 flex-col pointer-events-none">
      <h5 className="text-2xl">Ignacio&apos;s Three.js Playground</h5>
      <p className="text-xs text-center opacity-70 max-w-xs">
        This is a playground for Three.js. It&apos;s a place where I can
        experiment with different ideas and concepts. The code is available on{" "}
        <a
          href="https://github.com/luisignaciocc/three-js"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
        <br />
        <br />
        &quot;Don&apos;t behave as if you are destined to live forever.
        What&apos;s fated hangs over you. As long as you live and while you can,
        become good now&quot; - Marcus Aurelius
      </p>
    </div>
  );
};

export default _;
