export const HOME_STRINGS = {
  header: {
    title: 'Verifica tu billetito',
    subtitle: 'Consulta si el N° de serie está inhabilitado por el BCB',
    helpTitle: '¿Cómo se usa?',
  },
  scan: {
    title: 'Escanear billete',
    subtitle: 'Detecta el valor, número y letra automáticamente',
    hint: 'Apunta al número de serie del billete',
  },
  manual: {
    divider: 'o ingresa los datos manualmente',
    denominationLabel: '¿Cuánto vale el billete?',
    billBs: 'Bs.',
    billBcb: 'BCB',
    hintText: 'Los datos están en el anverso (cara frontal) del billete',
    serialLabel: 'Número de serie',
    serialPlaceholder: 'Ej: 067250001',
    serialHelp: 'Solo los números, sin espacios ni letras',
    seriesLabel: 'Letra de serie',
    seriesPlaceholder: 'Ej: B',
    seriesHelp: 'La letra junto al número en el billete (ej: A, B, C)',
  },
  buttons: {
    verify: 'Verificar billete',
    clear: 'Limpiar todo',
    ok: 'Entendido',
    cancel: 'Cancelar',
    captureTitle: 'Capturar ahora',
  },
  icons: {
    resultOk:       'checkmark-circle',
    resultObserved: 'alert-circle',
    resultInvalid:  'close-circle',
  },
  alerts: {
    noDenominationHeader: 'Denominación requerida',
    noDenominationMsg: 'Selecciona la denominación del billete (Bs. 10, 20, 50, 100 o 200).',
    noSerialHeader: 'Número de serie requerido',
    noSerialMsg: 'Ingresa el número de serie del billete.',
    noSeriesHeader: 'Serie requerida',
    noSeriesMsg: 'Ingresa la serie del billete (por ejemplo: A, B).',
    cameraErrorTitle: 'Error de cámara',
    cameraErrorMsg: 'No se pudo acceder a la cámara. Verifica los permisos.',
    noDetectionTitle: 'No se detectó',
    noDetectionMsg: 'No se encontraron dígitos en la imagen. Intenta acercarte más al número de serie.',
    processErrorTitle: 'Error al procesar',
    processErrorMsg: 'No se pudo procesar la imagen. Intenta de nuevo.',
  },
} as const;

export const VERIFICATION_STRINGS = {
  observedTitle: 'Serie Observada',
  observedMsg: (denomination: number, series: string) =>
    `Billete de Bs. ${denomination} Serie ${series} inhabilitado por el BCB (CP8/2026). No tiene valor legal.`,
  notObservedTitle: 'No Observado',
  notObservedMsg: (denomination: number, series: string) =>
    `Este billete de Bs. ${denomination} Serie ${series} no figura en la lista de billetes inhabilitados por el BCB.`,
};

export const TUTORIAL_NAV_STRINGS = {
  prev: 'Anterior',
  skip: 'Salir',
  next: 'Siguiente',
  done: '¡Listo!',
} as const;
