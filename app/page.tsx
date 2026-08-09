import type { Metadata } from "next";
import { Calculator } from "./components/Calculator";

export const metadata: Metadata = {
  title: "Full-Stack Calculator",
  description: "A focused full-stack calculator powered by a Python API.",
};

export default function Home() {
  return (
    <main className="page-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">FULL-STACK CALCULATOR</p>
        <h1 id="page-title">"Making Math simple"</h1>
        <p className="intro-copy">
          Choose an operation, enter your values, and let the Python service do
          the calculation.
        </p>
      </section>
      <Calculator />
      <p className="service-note">
        <span aria-hidden="true" /> Calculations are processed by the API
      </p>
    </main>
  );
}
