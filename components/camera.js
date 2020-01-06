import React from 'react'
import * as faceapi from 'face-api.js'

const Camera = () => {
  const videoRef = React.useRef(null)
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      let stream = null

      var constraints = { video: true }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(mediaStream => {
          video.srcObject = mediaStream
          video.onloadedmetadata = e => {
            video.play()

            const displaySize = { width: video.width, height: video.height }
            faceapi.matchDimensions(canvas, displaySize)

            async function onPlay() {
              const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()

              const dims = faceapi.matchDimensions(canvas, video, true)
              const resizedDetections = faceapi.resizeResults(detections, dims)
              faceapi.draw.drawDetections(canvas, resizedDetections)
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

              setTimeout(() => onPlay())
            }
            onPlay()
          }
        })
        .catch(err => {
          console.log(err.name + ': ' + err.message)
        })
    })
  }, [])

  return (
    <div className="container">
      <video ref={videoRef} width="720" height="560" muted></video>
      <canvas ref={canvasRef} />
      <style jsx>{`
        :global(body) {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }

        .container {
          position: relative;
        }
        canvas {
          position: absolute;
          left: 0;
          top: 0;
        }
      `}</style>
    </div>
  )
}

export default Camera
