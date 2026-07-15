import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Leadership from './sections/Leadership'
import Contact from './sections/Contact'

export default function GuiPane() {
  return (
    <div className="flex-1 flex flex-col">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Leadership />
      <Contact />
    </div>
  )
}
