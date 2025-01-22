"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./SoundRecorder.module.css";

const SoundRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (recording) {
      const context = new AudioContext();
      setAudioContext(context);
      const analyserNode = context.createAnalyser();
      setAnalyser(analyserNode);

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);
        visualize(analyserNode);
      });
    } else {
      audioContext?.close();
      setAudioContext(null);
      setAnalyser(null);
    }
  }, [recording]);

  const visualize = (analyser: AnalyserNode) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!recording) return;
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 4; // Aumentar a espessura da linha
      canvasCtx.strokeStyle = "rgb(179, 129, 255)";
      canvasCtx.fillStyle = "rgba(0, 0, 0, 0)"; // Garantir que o fundo seja transparente
      canvasCtx.shadowBlur = 10; // Adicionar desfoque à sombra
      canvasCtx.shadowColor = "rgb(102, 0, 255)"; // Cor da sombra

      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 165.0;
        const y = (v * canvas.height) / 1.5; // Aumentar a escala da onda

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  return (
    <div className={styles.soundContainer}>
      <canvas className={styles.canvas} ref={canvasRef} width="600" height="200"></canvas>
      <button className={styles.button} onClick={() => setRecording(!recording)}>
        {recording ? "Parar Gravação" : "Iniciar Gravação"}
      </button>
    </div>
  );
};

export default SoundRecorder;
