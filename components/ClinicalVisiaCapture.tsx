'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'
import { FaceMesh } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'
import {
  VISIA_CAPTURE_SEQUENCE,
  checkFrameQuality,
  analyzeWoodFluorescence,
  KIT_CHECKLIST,
  type CaptureModality,
  type WoodAnalysis,
} from '@/lib/maya-vision/clinical-capture-protocol'
import { analyzeSkinFromImageDataUrl, getMicroneedlingRx, getSkinFindings } from '@/lib/maya-vision/simple-skin-analysis'
import { generateSkinSpectralMaps, SPECTRAL_MODE_LABELS } from '@/lib/maya-vision/skin-spectral-maps'
import {
  buildFacialReport,
  getStructureReport,
  getVolumeReport,
  getEvidenceDisclaimer,
  type LandmarkPoint,
} from '@/lib/maya-vision/real-facial-analysis'

type Captures = Partial<Record<CaptureModality, string>>

export default function ClinicalVisiaCapture() {
  const webcamRef = useRef<Webcam>(null)
  const [phase, setPhase] = useState<'kit' | 'form' | 'capture' | 'processing' | 'report'>('kit')
  const [stepIndex, setStepIndex] = useState(0)
  const [captures, setCaptures] = useState<Captures>({})
  const [patient, setPatient] = useState({ name: '', phone: '', age: '' })
  const [liveOk, setLiveOk] = useState(false)
  const [liveMsg, setLiveMsg] = useState<string[]>([])
  const latestLm = useRef<LandmarkPoint[] | null>(null)
  const storedLm = useRef<Partial<Record<CaptureModality, LandmarkPoint[]>>>({})
  const cameraRef = useRef<Camera | null>(null)
  const [woodAnalysis, setWoodAnalysis] = useState<WoodAnalysis | null>(null)
  const [skinMaps, setSkinMaps] = useState<Awaited<ReturnType<typeof generateSkinSpectralMaps>> | null>(null)
  const [facialReport, setFacialReport] = useState<ReturnType<typeof buildFacialReport>>(null)
  const [skinReport, setSkinReport] = useState<Awaited<ReturnType<typeof analyzeSkinFromImageDataUrl>> | null>(null)

  const step = VISIA_CAPTURE_SEQUENCE[stepIndex]

  const onResults = useCallback(
    (results: { multiFaceLandmarks?: { x: number; y: number; z?: number }[][] }) => {
      if (phase !== 'capture' || !webcamRef.current?.video || !step) return
      const video = webcamRef.current.video
      if (!results.multiFaceLandmarks?.[0]) {
        setLiveOk(false)
        setLiveMsg(['Centre el rostro en el óvalo'])
        return
      }
      const lm = results.multiFaceLandmarks[0].map((p) => ({
        x: p.x,
        y: p.y,
        z: p.z ?? 0,
      }))
      latestLm.current = lm
      const q = checkFrameQuality(lm, video.videoWidth, video.videoHeight, step)
      setLiveOk(q.ok)
      setLiveMsg(q.messages)
    },
    [phase, step]
  )

  useEffect(() => {
    if (phase !== 'capture') {
      cameraRef.current?.stop()
      cameraRef.current = null
      return
    }
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    })
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
    faceMesh.onResults(onResults)
    const video = webcamRef.current?.video
    if (!video) return
    const camera = new Camera(video, {
      onFrame: async () => {
        if (webcamRef.current?.video) await faceMesh.send({ image: webcamRef.current.video })
      },
      width: 1280,
      height: 720,
    })
    cameraRef.current = camera
    camera.start()
    return () => {
      camera.stop()
    }
  }, [phase, onResults])

  const takePhoto = () => {
    const video = webcamRef.current?.video
    if (!video) return
    const c = document.createElement('canvas')
    c.width = video.videoWidth
    c.height = video.videoHeight
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.translate(c.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    const dataUrl = c.toDataURL('image/jpeg', 0.92)
    if (latestLm.current) storedLm.current[step.id] = latestLm.current.map((p) => ({ ...p }))

    const nextCaptures: Captures = { ...captures, [step.id]: dataUrl }
    setCaptures(nextCaptures)

    if (stepIndex < VISIA_CAPTURE_SEQUENCE.length - 1) {
      setStepIndex((i) => i + 1)
      setLiveOk(false)
    } else {
      setPhase('processing')
      runFullAnalysis(nextCaptures)
    }
  }

  const runFullAnalysis = async (all: Captures) => {
    const age = patient.age ? parseInt(patient.age, 10) : undefined
    const front = all.standard
    let skin = null
    if (front) {
      try {
        skin = await analyzeSkinFromImageDataUrl(front, age)
        setSkinReport(skin)
        setSkinMaps(await generateSkinSpectralMaps(front))
      } catch {
        /* ignore */
      }
    }
    if (all.wood) {
      try {
        setWoodAnalysis(await analyzeWoodFluorescence(all.wood))
      } catch {
        setWoodAnalysis(null)
      }
    }
    setFacialReport(
      buildFacialReport(
        storedLm.current.standard ?? null,
        storedLm.current.profile_right ?? null,
        storedLm.current.profile_left ?? null,
        skin,
        { age, ethnicity: 'latino', gender: 'M', imageSize: { w: 1280, h: 720 } }
      )
    )
    setPhase('report')
  }

  const volumeCopy = facialReport ? getVolumeReport(facialReport.mesh, 'ES') : null
  const structureCopy = facialReport
    ? getStructureReport(facialReport.mesh, facialReport.golden, 'ES')
    : null
  const skinCopy = skinReport ? getSkinFindings(skinReport, 'ES') : null
  const labels = SPECTRAL_MODE_LABELS.ES

  if (phase === 'kit') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Kit consultorio VISIA</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Protocolo Tipheret™: mismas distancias y lámparas cada vez. Lista para imprimir y pegar en cabina.
        </p>
        <ul className="space-y-2 text-xs mb-8">
          {KIT_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-cyan-500">□</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-amber-400 mb-6">
          Distancia estándar: 60 cm del mentón al celular. Altura: ojos al centro del encuadre.
        </p>
        <button
          type="button"
          onClick={() => setPhase('form')}
          className="w-full bg-cyan-600 py-4 rounded-xl font-bold uppercase text-sm tracking-widest"
        >
          Kit listo — iniciar captura
        </button>
        <a href="/KIT_CONSULTORIO_INICIAL.txt" className="block text-center text-cyan-400 text-xs mt-4 underline">
          Descargar guía completa del kit (TXT)
        </a>
      </div>
    )
  }

  if (phase === 'form') {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col justify-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-6 uppercase tracking-widest text-center">Paciente</h2>
        <input
          className="w-full border-b border-white/30 bg-transparent p-3 mb-4 outline-none"
          placeholder="Nombre"
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
        />
        <input
          className="w-full border-b border-white/30 bg-transparent p-3 mb-4 outline-none"
          placeholder="WhatsApp"
          onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
        />
        <input
          className="w-full border-b border-white/30 bg-transparent p-3 mb-8 outline-none"
          placeholder="Edad"
          type="number"
          onChange={(e) => setPatient({ ...patient, age: e.target.value })}
        />
        <button
          type="button"
          disabled={!patient.name || !patient.phone}
          onClick={() => {
            setStepIndex(0)
            setPhase('capture')
          }}
          className="w-full bg-white text-black py-4 rounded-xl font-bold disabled:opacity-40"
        >
          Abrir cámara estándar
        </button>
      </div>
    )
  }

  if (phase === 'capture' && step) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="p-4 bg-zinc-900 border-b border-zinc-800">
          <p className="text-[10px] text-cyan-400 uppercase tracking-widest">
            Paso {stepIndex + 1}/{VISIA_CAPTURE_SEQUENCE.length}
          </p>
          <h2 className="text-lg font-bold text-white">{step.title}</h2>
          <p className="text-xs text-zinc-400">{step.subtitle}</p>
          <p className="text-[10px] text-zinc-300 mt-2">💡 {step.lampInstruction}</p>
          <p className="text-[10px] text-zinc-500">{step.roomInstruction}</p>
        </div>
        <div className="relative flex-1 flex items-center justify-center">
          <Webcam
            ref={webcamRef}
            mirrored
            className="w-full max-h-[70vh] object-cover"
            videoConstraints={{ facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }}
          />
          <div
            className={`absolute border-2 rounded-[50%] w-[55%] aspect-[3/4] pointer-events-none ${
              liveOk ? 'border-emerald-400' : 'border-amber-400 animate-pulse'
            }`}
          />
          <div className="absolute bottom-24 inset-x-4 text-center">
            {liveMsg.map((m) => (
              <p key={m} className={`text-xs mb-1 ${liveOk ? 'text-emerald-300' : 'text-amber-300'}`}>
                {m}
              </p>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={takePhoto}
          disabled={!liveOk}
          className="m-4 py-4 bg-cyan-600 rounded-xl font-bold uppercase text-sm disabled:opacity-40"
        >
          Capturar {step.title}
        </button>
      </div>
    )
  }

  if (phase === 'processing') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400">
        <p className="animate-pulse uppercase tracking-widest text-sm">Procesando serie VISIA…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-8 px-4">
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl p-6 mb-4">
        <div className="flex justify-between border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-serif uppercase">Tipheret Clinical VISIA™</h1>
            <p className="text-xs text-gray-500">{patient.name} · ID {patient.phone}</p>
          </div>
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString('es-CO')}</p>
        </div>
        <p className="text-[9px] text-gray-600 mb-4 uppercase">{getEvidenceDisclaimer('ES')}</p>

        <h2 className="text-sm font-bold uppercase mb-3">Serie estandarizada (5 capturas)</h2>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {VISIA_CAPTURE_SEQUENCE.map((s) => (
            <div key={s.id} className="relative aspect-square bg-gray-100 overflow-hidden">
              {captures[s.id] ? (
                <img src={captures[s.id]} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[8px] p-2 text-red-500">Falta</span>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[6px] p-1 leading-tight">
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {woodAnalysis && captures.wood && (
          <div className="mb-6 p-3 bg-violet-50 border border-violet-200 text-xs">
            <strong>Wood (UV):</strong> índice fluorescencia {woodAnalysis.fluorescenceIndex}/100 —{' '}
            {woodAnalysis.summary}
          </div>
        )}

        {skinMaps && (
          <>
            <h2 className="text-sm font-bold uppercase mb-2">Mapas dérmicos (desde luz estándar)</h2>
            <p className="text-[8px] text-amber-800 mb-2">{labels.disclaimer}</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(
                [
                  ['natural', skinMaps.natural, labels.natural],
                  ['erythema', skinMaps.erythema, labels.erythema],
                  ['melanin', skinMaps.melanin, labels.melanin],
                  ['texture', skinMaps.texture, labels.texture],
                ] as const
              ).map(([key, src, label]) => (
                <div key={key} className="relative aspect-[3/4]">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-[6px] p-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {facialReport && (
          <div className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <p className="font-bold">Φ / Simetría / Laxitud</p>
              <p>
                {facialReport.mesh.goldenRatioScore} / {facialReport.mesh.leftRightSymmetry} /{' '}
                {facialReport.mesh.laxityScore}
              </p>
            </div>
            <div>
              <p className="font-bold">Volumen estimado</p>
              <p>{volumeCopy?.volumeCc} cc</p>
            </div>
            {skinCopy && (
              <div className="col-span-2">
                <p className="font-bold">Piel · {getMicroneedlingRx(skinReport?.score ?? 60, 'ES')}</p>
                <p className="text-gray-700">{skinCopy.findingText}</p>
              </div>
            )}
            {structureCopy && (
              <div className="col-span-2 text-gray-700">
                <p>{structureCopy.smasDx}</p>
                <p>{structureCopy.boneDx}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-[210mm] mx-auto flex gap-3 no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 bg-black text-white py-3 rounded-lg font-bold text-sm"
        >
          Imprimir PDF
        </button>
        <button
          type="button"
          onClick={() => {
            setPhase('kit')
            setStepIndex(0)
            setCaptures({})
            storedLm.current = {}
          }}
          className="flex-1 border border-black py-3 rounded-lg font-bold text-sm"
        >
          Nuevo paciente
        </button>
      </div>
    </div>
  )
}
