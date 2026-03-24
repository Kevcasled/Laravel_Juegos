import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export async function createAnimatedPlayer() {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    
    // Carga tu modelo GLTF/GLB aquí
    // Puedes usar un path relativo como '/models/runner.glb'
    loader.load(
      '/models/runner.glb', // ← Cambia esto por tu modelo
      
      (gltf) => {
        const model = gltf.scene
        
        // Escala y posición del modelo
        model.scale.set(0.5, 0.5, 0.5)
        model.position.set(0, 0.45, 0)
        
        // Habilitar sombras en todos los meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        // Configurar animaciones
        let mixer = null
        let runAction = null
        
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          
          // Buscar la animación de correr
          // El nombre puede variar: "Run", "Running", "run", etc.
          const runClip = gltf.animations.find(clip => 
            clip.name.toLowerCase().includes('run')
          ) || gltf.animations[0] // Usa la primera si no encuentra
          
          if (runClip) {
            runAction = mixer.clipAction(runClip)
            runAction.play()
          }
        }
        
        // Propiedades de juego
        model.userData = {
          laneX: 0,
          targetX: 0,
          isJumping: true,
          vy: 0,
          groundY: 0.45,
          mixer: mixer, // Guardar el mixer para actualizar
          runAction: runAction
        }
        
        resolve(model)
      },
      
      // Progreso (opcional)
      (progress) => {
        console.log(`Cargando: ${(progress.loaded / progress.total * 100).toFixed(0)}%`)
      },
      
      // Error
      (error) => {
        console.error('Error cargando el modelo:', error)
        reject(error)
      }
    )
  })
}

// Función para actualizar las animaciones
export function updatePlayerAnimation(player, dt) {
  if (player.userData.mixer) {
    player.userData.mixer.update(dt)
  }
}
