export interface TutorialStep {
  gradient: string;
  charPose: string;
  bubble: string;
  title: string;
  text: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    gradient: 'linear-gradient(160deg, #0e6644 0%, #178558 100%)',
    charPose: 'pose-wave',
    bubble: '¡Hola! Te enseño\ncómo verificar\ntu billete',
    title: '¡Bienvenido a Verifica tu billetito!',
    text: 'Con esta app sabes en segundos si tu billete boliviano está en la lista de billetes inhabilitados por el Banco Central de Bolivia (BCB).',
  },
  {
    gradient: 'linear-gradient(160deg, #0e6644 0%, #178558 100%)',
    charPose: 'pose-point',
    bubble: '¡Toca el botón\nde cámara\ny listo!',
    title: 'La forma más fácil: escanear',
    text: 'Toca "Escanear billete" y apunta la cámara al billete completo. La app detecta sola el valor (Bs. 10, 20, 50...), el número de serie y la letra, ¡sin escribir nada!',
  },
  {
    gradient: 'linear-gradient(160deg, #9e4a08 0%, #c86010 100%)',
    charPose: 'pose-type',
    bubble: 'También puedes\nescribirlo\ntú mismo',
    title: 'O ingrésalo a mano',
    text: 'Si prefieres, elige el valor del billete (Bs. 10, 20, 50...), luego escribe el número de serie y la letra que aparecen en el anverso del billete.',
  },
  {
    gradient: 'linear-gradient(160deg, #8c0f1c 0%, #be1828 100%)',
    charPose: 'pose-celebrate',
    bubble: '¡Presiona verificar\ny sabrás\nel resultado!',
    title: '¡Verifica y conoce el resultado!',
    text: 'Toca "Verificar billete" y en segundos sabrás si está inhabilitado (observado) o en buen estado (no observado). ¡Así de simple!',
  },
];
