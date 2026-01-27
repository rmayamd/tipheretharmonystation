/**
 * Tipheret Center - Landing Page Pública
 * Cartagena, Colombia
 */

'use client'

import Link from 'next/link'
import { Sparkles, Phone, Mail, MapPin, Calendar, Award, Heart, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-300 animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-light mb-4 tracking-wide">
            TIPHERET CENTER
          </h1>
          
          <p className="text-2xl md:text-3xl font-light mb-2 text-amber-200">
            תפארת
          </p>
          
          <p className="text-xl md:text-2xl font-light mb-12 text-purple-200">
            Belleza · Armonía · Equilibrio
          </p>
          
          <p className="text-lg md:text-xl max-w-3xl mb-12 leading-relaxed text-purple-100">
            Centro de Medicina Estética y Bienestar Integral en Cartagena, Colombia.
            Donde la ciencia encuentra el arte de la belleza natural.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="#servicios"
              className="px-10 py-4 bg-amber-400 text-purple-900 rounded-full text-lg font-semibold hover:bg-amber-300 transition-all shadow-2xl hover:scale-105"
            >
              Descubre Nuestros Servicios
            </Link>
            
            <Link 
              href="#contacto"
              className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/50 rounded-full text-lg font-semibold hover:bg-white/20 transition-all"
            >
              Agenda tu Consulta
            </Link>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <MapPin className="w-6 h-6 mb-2 mx-auto" />
            <p className="text-sm">Cartagena de Indias, Colombia</p>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-purple-50 to-amber-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-5xl font-light text-purple-900 mb-8">
            Tu Belleza Natural, Perfeccionada
          </h2>
          
          <p className="text-xl text-purple-800 leading-relaxed mb-8">
            En Tipheret Center, no transformamos. <strong>Restauramos</strong>.
          </p>
          
          <p className="text-lg text-purple-700 leading-relaxed">
            Cada rostro tiene proporciones únicas que definen su belleza inherente.
            Nuestro enfoque combina la precisión de la medicina avanzada con la 
            sensibilidad artística para revelar tu mejor versión, naturalmente.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-light text-center text-purple-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-center text-purple-700 mb-16 text-lg">
            Tratamientos personalizados para resultados excepcionales
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Cirugía Facial */}
            <div className="group bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-all">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Cirugía Facial Armónica
              </h3>
              
              <p className="text-purple-700 mb-6 leading-relaxed">
                Contorno facial, rinoplastia, lifting, mentoplastia.
                Resultados naturales que realzan tu belleza única.
              </p>
              
              <ul className="text-sm text-purple-600 space-y-2">
                <li>✓ Análisis facial personalizado</li>
                <li>✓ Técnicas mínimamente invasivas</li>
                <li>✓ Recuperación optimizada</li>
              </ul>
            </div>

            {/* Tratamientos No Quirúrgicos */}
            <div className="group bg-gradient-to-br from-amber-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-all">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Medicina Estética Avanzada
              </h3>
              
              <p className="text-purple-700 mb-6 leading-relaxed">
                Rejuvenecimiento facial sin cirugía. Resultados inmediatos,
                naturales y duraderos.
              </p>
              
              <ul className="text-sm text-purple-600 space-y-2">
                <li>✓ Rellenos y bioestimuladores</li>
                <li>✓ Toxina botulínica premium</li>
                <li>✓ Tecnología de última generación</li>
              </ul>
            </div>

            {/* Wellness Integral */}
            <div className="group bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-all">
                <Star className="w-8 h-8 text-indigo-600" />
              </div>
              
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Bienestar & Longevidad
              </h3>
              
              <p className="text-purple-700 mb-6 leading-relaxed">
                Programas personalizados de optimización biológica
                y medicina regenerativa.
              </p>
              
              <ul className="text-sm text-purple-600 space-y-2">
                <li>✓ Análisis biológico completo</li>
                <li>✓ Protocolos anti-aging</li>
                <li>✓ Nutrición y suplementación</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CIRUGÍA CORPORAL */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-light text-center text-purple-900 mb-4">
            Contorno Corporal
          </h2>
          <p className="text-center text-purple-700 mb-16 text-lg">
            Esculpe tu figura ideal con las técnicas más avanzadas
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Aumento Mamario Personalizado
              </h3>
              <p className="text-purple-700 mb-4">
                Implantes de última generación con garantía extendida.
                Resultados naturales y proporcionados.
              </p>
              <ul className="text-sm text-purple-600 space-y-2">
                <li>✓ Simulación 3D pre-operatoria</li>
                <li>✓ Implantes premium (Motiva, Mentor)</li>
                <li>✓ Técnicas de recuperación rápida</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Lipoescultura de Alta Definición
              </h3>
              <p className="text-purple-700 mb-4">
                Eliminación de grasa localizada con marcación muscular.
                Resultados atléticos y naturales.
              </p>
              <ul className="text-sm text-purple-600 space-y-2">
                <li>✓ Tecnología VASER</li>
                <li>✓ Lipotransferencia cuando se requiere</li>
                <li>✓ Resultados permanentes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="py-20 bg-purple-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-light text-center mb-16">
            La Experiencia Tipheret
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div>
              <Award className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-semibold mb-2">Excelencia Médica</h3>
              <p className="text-purple-200 text-sm">
                Cirujanos certificados con experiencia internacional
              </p>
            </div>
            
            <div>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-semibold mb-2">Tecnología Avanzada</h3>
              <p className="text-purple-200 text-sm">
                Equipamiento de última generación para resultados óptimos
              </p>
            </div>
            
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-semibold mb-2">Atención Personalizada</h3>
              <p className="text-purple-200 text-sm">
                Cada paciente es único, cada tratamiento es exclusivo
              </p>
            </div>
            
            <div>
              <Star className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-semibold mb-2">Resultados Naturales</h3>
              <p className="text-purple-200 text-sm">
                Belleza armónica que realza tu esencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-amber-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-light text-purple-900 mb-8">
            Agenda tu Consulta
          </h2>
          
          <p className="text-xl text-purple-700 mb-12">
            El primer paso hacia tu transformación comienza con una conversación
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Phone className="w-8 h-8 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-purple-900 mb-2">Teléfono</h3>
              <p className="text-purple-700">+57 300 123 4567</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-purple-900 mb-2">Email</h3>
              <p className="text-purple-700">info@tipheretcenter.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-purple-900 mb-2">Ubicación</h3>
              <p className="text-purple-700">Cartagena, Colombia</p>
            </div>
          </div>
          
          <Link
            href="/maya-bio-mirror"
            className="inline-block px-12 py-4 bg-purple-900 text-white rounded-full text-lg font-semibold hover:bg-purple-800 transition-all shadow-xl hover:scale-105"
          >
            <Calendar className="inline-block w-5 h-5 mr-2" />
            Reservar Consulta
          </Link>
          
          <p className="text-sm text-purple-600 mt-8">
            Primera consulta sin compromiso · Valoración completa incluida
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-purple-950 text-purple-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-light mb-4 text-white">
            ✨ TIPHERET CENTER
          </h3>
          <p className="mb-4">תפארת - Belleza · Armonía · Equilibrio</p>
          <p className="text-sm text-purple-400 mb-6">
            Cartagena de Indias, Colombia
          </p>
          
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="hover:text-amber-300 transition-colors">Instagram</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Facebook</a>
            <a href="#" className="hover:text-amber-300 transition-colors">WhatsApp</a>
          </div>
          
          <p className="text-xs text-purple-400">
            © 2026 Tipheret Center. Todos los derechos reservados.
          </p>
          
          {/* Link oculto para acceso interno */}
          <Link 
            href="/maya-bio-mirror" 
            className="text-xs text-purple-900 hover:text-purple-700 mt-4 inline-block"
          >
            •
          </Link>
        </div>
      </footer>
    </div>
  )
}
